// ── Credenciais ──────────────────────────────────────────────────────────────
const WAYMB_CLIENT_ID     = 'davi.copy_91ca2801';
const WAYMB_CLIENT_SECRET = 'cd4ec68b-ebed-4d7b-a0c8-45eb8ce13e60';
const WAYMB_ACCOUNT_EMAIL = 'david.fsbravo@gmail.com';
const UTMIFY_TOKEN        = 'NF5Q4J6TPSudZHAk4WrJzsiSQItAqCYUEhXe';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Método não permitido' });

  const { amount, method, name, phone, email } = req.body ?? {};

  // ── Validação ────────────────────────────────────────────────────────────
  const valor    = parseFloat(amount);
  const metodo   = ['mbway', 'multibanco'].includes(method) ? method : null;
  const nome     = (name  ?? '').trim();
  const telefone = (phone ?? '').replace(/\D/g, '');
  const emailStr = (email ?? '').trim() || 'doador@refugiotiare.com';

  if (!valor || valor <= 0)   return res.status(400).json({ error: 'Valor inválido' });
  if (!metodo)                return res.status(400).json({ error: 'Método de pagamento inválido' });
  if (!nome)                  return res.status(400).json({ error: 'Nome obrigatório' });
  if (telefone.length < 9)    return res.status(400).json({ error: 'Número de telemóvel inválido' });

  // Adiciona indicativo PT se necessário
  const phoneFormatted = telefone.startsWith('00') || telefone.startsWith('+')
    ? '+' + telefone.replace(/^\+/, '')
    : '+351' + telefone;

  // URL do webhook (mesmo domínio, rota /api/webhook)
  const host        = req.headers.host ?? '';
  const proto       = host.includes('localhost') ? 'http' : 'https';
  const callbackUrl = `${proto}://${host}/api/webhook`;

  // ── 1. Criar transação na WayMB ──────────────────────────────────────────
  let waymb;
  try {
    const waymb_res = await fetch('https://api.waymb.com/transactions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:          WAYMB_CLIENT_ID,
        client_secret:      WAYMB_CLIENT_SECRET,
        account_email:      WAYMB_ACCOUNT_EMAIL,
        amount:             valor,
        method:             metodo,
        currency:           'EUR',
        paymentDescription: 'Doação Refúgio Tia Rê',
        callbackUrl,
        payer: {
          name:     nome,
          email:    emailStr,
          document: '000000000',
          phone:    phoneFormatted,
        },
      }),
    });

    waymb = await waymb_res.json();

    if (!waymb_res.ok || !waymb.transactionID) {
      console.error('[WayMB] Erro:', waymb_res.status, JSON.stringify(waymb));
      return res.status(502).json({ error: 'Erro ao criar pagamento. Tente novamente.' });
    }
  } catch (err) {
    console.error('[WayMB] Exceção:', err);
    return res.status(502).json({ error: 'Falha de comunicação com o gateway de pagamento.' });
  }

  const transactionId = waymb.transactionID;

  // ── 2. Enviar evento PENDING para UTMify ─────────────────────────────────
  try {
    await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${UTMIFY_TOKEN}`,
      },
      body: JSON.stringify({
        orderId:   transactionId,
        status:    'pending',
        createdAt: new Date().toISOString(),
        isTest:    false,
        platform:  'RefugioTiaRe',
        customer: {
          name:    nome,
          email:   emailStr,
          phone:   phoneFormatted,
          country: 'PT',
        },
        products: [{
          id:           'doacao-refugio-tiare',
          name:         'Doação Refúgio Tia Rê',
          priceInCents: Math.round(valor * 100),
        }],
      }),
    });
  } catch (err) {
    // Não bloqueia o fluxo se UTMify falhar
    console.error('[UTMify] Erro ao enviar pending:', err);
  }

  // ── 3. Resposta ao frontend ───────────────────────────────────────────────
  const result = {
    success:       true,
    transactionId,
    method:        metodo,
    amount:        valor,
  };

  if (metodo === 'multibanco' && waymb.referenceData) {
    result.referenceData = waymb.referenceData;
  } else if (metodo === 'mbway') {
    result.mbwayGenerated = waymb.generatedMBWay ?? true;
  }

  return res.status(200).json(result);
}

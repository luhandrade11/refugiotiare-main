const UTMIFY_TOKEN = 'NF5Q4J6TPSudZHAk4WrJzsiSQItAqCYUEhXe';

// Mapeamento WayMB → UTMify
const STATUS_MAP = {
  COMPLETED: 'paid',
  DECLINED:  'refused',
};

export default async function handler(req, res) {
  // Responde 200 imediatamente — WayMB não vai reenviar
  res.status(200).json({ received: true });

  if (req.method !== 'POST') return;

  const body = req.body ?? {};

  const transactionId = body.transactionId ?? body.id ?? null;
  const status        = (body.status ?? '').toUpperCase();
  const amount        = parseFloat(body.amount ?? body.value ?? 0);
  const payerName     = body.payer?.name  ?? 'Doador';
  const payerEmail    = body.payer?.email ?? body.email ?? 'doador@refugiotiare.com';

  if (!transactionId || !status) {
    console.error('[Webhook] transactionId ou status em falta', body);
    return;
  }

  const utmifyStatus = STATUS_MAP[status];

  if (!utmifyStatus) {
    // PENDING já foi enviado na criação — ignorar aqui
    console.log(`[Webhook] Status '${status}' ignorado`);
    return;
  }

  const utmify_payload = {
    orderId:   transactionId,
    status:    utmifyStatus,
    createdAt: new Date().toISOString(),
    isTest:    false,
    platform:  'RefugioTiaRe',
    customer: {
      name:    payerName,
      email:   payerEmail,
      country: 'PT',
    },
    products: [{
      id:           'doacao-refugio-tiare',
      name:         'Doação Refúgio Tia Rê',
      priceInCents: Math.round(amount * 100),
    }],
  };

  if (utmifyStatus === 'paid') {
    utmify_payload.approvedDate = new Date().toISOString();
  }

  try {
    const utmify_res = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${UTMIFY_TOKEN}`,
      },
      body: JSON.stringify(utmify_payload),
    });

    if (utmify_res.ok) {
      console.log(`[Webhook] UTMify notificado: order=${transactionId} status=${utmifyStatus}`);
    } else {
      const err = await utmify_res.text();
      console.error(`[Webhook] UTMify HTTP ${utmify_res.status}:`, err);
    }
  } catch (err) {
    console.error('[Webhook] Exceção ao notificar UTMify:', err);
  }
}

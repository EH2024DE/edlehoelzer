const declaration = 'Hiermit widerrufe ich den nachfolgend bezeichneten Vertrag.';

// The storage adapter must atomically get or create by request ID.
// The delivery adapter must deduplicate by receipt ID across retries.
export async function receiveWithdrawal(input, {store, deliver, now = () => new Date()}) {
  const invalid = () => ({status: 400, body: {error: 'INVALID_WITHDRAWAL'}});
  if (!input || typeof input !== 'object' || Array.isArray(input)) return invalid();
  const {requestId} = input;
  if (typeof requestId !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(requestId)) return invalid();
  const field = (key, max) => typeof input[key] === 'string' && input[key].length <= max ? input[key].trim() : '';
  const customer = field('customer', 120);
  const contract = field('contract', 500);
  const email = field('email', 254);
  if (!customer || !contract || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return invalid();

  try {
    const receipt = await store.getOrCreate({requestId, customer, contract, email, receivedAt: now().toISOString(), declaration});
    if (receipt.customer !== customer || receipt.contract !== contract || receipt.email !== email) {
      return {status: 409, body: {error: 'REQUEST_ID_CONFLICT'}};
    }
    await deliver({
      idempotencyKey: receipt.requestId,
      to: receipt.email,
      subject: 'Eingang deiner Widerrufserklaerung',
      text: [
        receipt.declaration, 'Name: ' + receipt.customer, 'Vertrag: ' + receipt.contract,
        'Eingang (UTC): ' + receipt.receivedAt,
        'Diese Nachricht bestaetigt den Eingang, nicht die Wirksamkeit des Widerrufs.'
      ].join('\n')
    });
    return {status: 200, body: {receivedAt: receipt.receivedAt}};
  } catch {
    return {status: 503, body: {error: 'RECEIPT_UNCONFIRMED'}};
  }
}

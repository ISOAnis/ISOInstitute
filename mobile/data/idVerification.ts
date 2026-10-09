import { now } from './clock';
import type { IdCheck, IdCheckStatus } from './types';

/** Local image URIs handed straight to the provider. Nothing here is persisted. */
export interface IdCheckInput {
  idPhotoUri: string;
  selfieUri: string;
}

/** What a real provider (Persona, Stripe Identity, Onfido) plugs into. */
export interface IdVerificationProvider {
  name: string;
  verify(input: IdCheckInput): Promise<{ status: IdCheckStatus; referenceId: string }>;
}

const MOCK_DELAY_MS = 1400;

/** Prototype provider: waits a beat, then passes any check with both photos. */
const mockProvider: IdVerificationProvider = {
  name: 'mock',
  async verify(input) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    const ref = `mock_${Date.now().toString(36)}`;
    if (!input.idPhotoUri || !input.selfieUri) return { status: 'failed', referenceId: ref };
    return { status: 'verified', referenceId: ref };
  },
};

let provider: IdVerificationProvider = mockProvider;

export function setIdVerificationProvider(next: IdVerificationProvider): void {
  provider = next;
}

/** Runs the check and returns only the outcome. Callers must drop the images afterwards. */
export async function verifyIdentity(input: IdCheckInput): Promise<IdCheck> {
  const { status, referenceId } = await provider.verify(input);
  return { status, referenceId, provider: provider.name, checkedAt: now().toISOString().slice(0, 19) };
}

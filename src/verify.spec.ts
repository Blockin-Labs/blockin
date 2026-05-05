/**
 * EIP-4361 conformance tests for the SIWBB challenge construction and
 * parsing. We rebuild the public API surface from the (un-built) source
 * to catch construct → parse round-trips and the specific deviations
 * tracked in `feat/siwe-conformance`:
 *
 *   - Not Before line previously emitted a trailing newline that broke
 *     the parser when Resources followed.
 *   - `Request ID` field was missing entirely.
 *   - Statement allowed embedded newlines, which produces a message no
 *     SIWE-aware parser can recover offsets for.
 *   - Nonce had no length / charset validation, so callers could
 *     produce messages that strict SIWE libraries reject.
 */

import { createChallenge, constructChallengeObjectFromString } from './verify';

const constructChallenge = <T extends import('./types/verify.types').ChallengeParams<bigint>>(c: T) => createChallenge(c);
import type { ChallengeParams } from './types/verify.types';

const COSMOS_ADDR = 'bb1qaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function baseChallenge(overrides: Partial<ChallengeParams<bigint>> = {}): ChallengeParams<bigint> {
  return {
    domain: 'https://bitbadges.io',
    statement: 'Sign in only if prompted by a trusted party.',
    address: COSMOS_ADDR,
    uri: 'https://bitbadges.io',
    nonce: 'abc12345',
    version: '1',
    chainId: '1',
    issuedAt: '2026-05-05T00:00:00.000Z',
    ...overrides
  };
}

describe('SIWE conformance — message construction', () => {
  it('emits Request ID between Not Before and Resources', () => {
    const c = baseChallenge({
      notBefore: '2026-05-05T01:00:00.000Z',
      requestId: 'req-12345',
      resources: ['https://example.com/a']
    });
    const msg = constructChallenge(c);
    const lines = msg.split('\n');

    const idxNotBefore = lines.findIndex((l) => l.startsWith('Not Before:'));
    const idxRequestId = lines.findIndex((l) => l.startsWith('Request ID:'));
    const idxResources = lines.findIndex((l) => l === 'Resources:');

    expect(idxNotBefore).toBeGreaterThan(0);
    expect(idxRequestId).toBeGreaterThan(idxNotBefore);
    expect(idxResources).toBeGreaterThan(idxRequestId);
    expect(lines[idxRequestId]).toBe('Request ID: req-12345');
  });

  it('does not append a trailing newline after Not Before', () => {
    // Specific regression for the parser-shifting bug: previously the
    // construction wrote `Not Before: ...\n` which produced a blank
    // line that resource parsing then misaligned on. Assert directly
    // that no blank line exists between Not Before and the next field.
    const c = baseChallenge({
      notBefore: '2026-05-05T01:00:00.000Z',
      resources: ['https://example.com/a']
    });
    const msg = constructChallenge(c);
    const lines = msg.split('\n');
    const idxNotBefore = lines.findIndex((l) => l.startsWith('Not Before:'));
    expect(lines[idxNotBefore + 1]).toBe('Resources:');
  });

  it('rejects a statement that contains a newline', () => {
    const c = baseChallenge({ statement: 'line1\nline2' });
    expect(() => constructChallenge(c)).toThrow(/EIP-4361/);
  });

  it('rejects a nonce shorter than 8 alphanumeric characters', () => {
    expect(() => constructChallenge(baseChallenge({ nonce: 'short' }))).toThrow(/8 alphanumeric/);
    // Also rejects non-alphanumeric chars even if length ok.
    expect(() => constructChallenge(baseChallenge({ nonce: 'abc-12345' }))).toThrow(/8 alphanumeric/);
  });
});

describe('SIWE conformance — round-trip parsing', () => {
  it('parses Request ID back from a constructed message', () => {
    const original = baseChallenge({ requestId: 'rid-9876' });
    const msg = constructChallenge(original);
    const parsed = constructChallengeObjectFromString(msg, (n) => BigInt(n.toString()));
    expect(parsed.requestId).toBe('rid-9876');
  });

  it('round-trips Not Before alongside Resources after the bug fix', () => {
    const original = baseChallenge({
      notBefore: '2026-05-05T01:00:00.000Z',
      resources: ['https://example.com/a', 'https://example.com/b']
    });
    const msg = constructChallenge(original);
    const parsed = constructChallengeObjectFromString(msg, (n) => BigInt(n.toString()));
    expect(parsed.notBefore).toBe('2026-05-05T01:00:00.000Z');
    expect(parsed.resources).toEqual(['https://example.com/a', 'https://example.com/b']);
  });

  it('preserves the Asset Ownership Requirements extension block', () => {
    // The extension block sits after Resources. Strict SIWE parsers
    // ignore everything after Resources, but our own parser still
    // needs to round-trip it.
    const original = baseChallenge({
      assetOwnershipRequirements: {
        assets: [
          {
            chain: 'BitBadges',
            collectionId: 1n,
            assetIds: [{ start: 1n, end: 1n }],
            ownershipTimes: [{ start: 0n, end: 0n }],
            mustOwnAmounts: { start: 1n, end: 1n }
          }
        ]
      }
    });
    const msg = constructChallenge(original);
    expect(msg).toContain('Asset Ownership Requirements:');
    const parsed = constructChallengeObjectFromString(msg, (n) => BigInt(n.toString()));
    expect(parsed.assetOwnershipRequirements).toBeDefined();
  });
});

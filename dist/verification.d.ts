export declare function createChallenge(domain: string, statement: string, address: string, uri: string, expirationDate?: string, notBefore?: string, resources?: string[]): Promise<string>;
export declare function verifyChallenge(originalChallenge: Uint8Array, signedChallenge: Uint8Array): Promise<string>;

export interface EIP4361Challenge {
    domain: string;
    address: string;
    statement?: string;
    uri: string;
    version: string;
    chainId: string;
    nonce: number;
    issuedAt: string;
    expirationDate?: string;
    notBefore?: string;
    resources?: string[];
}
export declare type ChallengeParams = {
    domain: string;
    statement: string;
    address: string;
    uri: string;
    version?: string;
    chainId?: string;
    issuedAt?: string;
    expirationDate?: string;
    notBefore?: string;
    resources?: any;
};

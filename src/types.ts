interface ICreateTxn {(assetParams: MakeAssetParams): Promise<any>}
interface IMakeAssetOptInTxn {(assetParams: MakeOptInAssetParams): Promise<any>}
interface IMakeAssetTransferTxn {(assetParams: MakeTransferAssetParams): Promise<any>}
interface IMakePaymentTxn {(assetParams: MakePaymentParams): Promise<any>}
interface ISendTx {(stxs: Uint8Array | Uint8Array[]): Promise<any>}

interface IGetPublicKey {(address: string): string}
interface IGetAccountInfo {(address: string): Promise<Record<string, any>>}
interface IGetStatus {(): Promise<Record<string, any>>}
interface IGetBlock {(nonce: number): Promise<Record<string, any>>}
interface IGetAssetIndex {(txId: string): Promise<any>}
interface IGetTransactionParams {(): Promise<any>}
interface IGetUnsignedTxnAsStr {(txn: any): string}
interface ICheckAddress {(address: string): boolean}
interface IGetOriginalSignature {(txn: any): Promise<Uint8Array>}
interface IGetSignature {(txn: any, message: string, result: Array<string | null>): Promise<Buffer | undefined>}
interface IIsValidAddress {(address: string): boolean}
interface IDecodeAddressGetPubKey {(address: string): Uint8Array}

export interface IClient {
    server: string,
    indexServer: string,
    port: string,
    token: any,
    client: any,
    indexer: any,
    makeAssetTxn: ICreateTxn,
    makeAssetOptInTxn: IMakeAssetOptInTxn,
    makeAssetTransferTxn: IMakeAssetTransferTxn,
    makePaymentTxn: IMakePaymentTxn,
    sendTxn: ISendTx,
    
    getTransactionParams: IGetTransactionParams,
    getPublicKey: IGetPublicKey,
    getAccountInfo: IGetAccountInfo,
    getStatus: IGetStatus,
    getBlock: IGetBlock,
    getAssetIndex: IGetAssetIndex,
    getUnsignedTxnAsStr: IGetUnsignedTxnAsStr
    checkAssress: ICheckAddress,
    getOriginalSignature: IGetOriginalSignature,
    getSignature: IGetSignature,
    isValidAddress: IIsValidAddress,
    decodeAddressGetPubKey: IDecodeAddressGetPubKey
}

export interface EIP4361Challenge {
    domain: string;                 // Valid URI
    address: string;                // Valid Algo Adress
    statement?: string;             // Any string
    uri: string;                    // Valid URI
    version: string;                // Set at 1; Used for EIP-4361 version, but there is only one version
    chainId: string;                // Set to 1 since we will be using mainnet
    nonce: number;                  // Recent block hash
    issuedAt: string;               // ISO 8601 Date Specification (new Date().toISOString() in JavaScript)
    expirationDate?: string;        // Same as issuedAt
    notBefore?: string;             // Same as issuedAt
    // requestId?: string;          // Said it was optional and for simplicity, I am leaving out
    resources?: string[];           // We will use this field for the requested asset IDs, thus it is marked as required
}

// Create*Params is Blockin types
// Make*Params is ChainDriver types

export type CreateAssetParams = {
    from: string,
    to?: string, 
    assetName?: string, 
    assetURL?: string, 
    note?: string,
    amount?: number,
    unitName?: string, 
    decimals?: number,
    total?: number, 
    assetMetadataHash?: string | Uint8Array, 
    extras?: any
}

export type MakeAssetParams = {
    from: string,
    to: string, 
    assetName: string, 
    assetURL: string, 
    note: string,
    amount: number,
    unitName: string, 
    decimals: number,
    total: number, 
    assetMetadataHash: string | Uint8Array, 
    extras: any
}

export type OptInAssetParams = {
    to: string, 
    from?: string,
    assetIndex: number,
    extras?: any
}

export type MakeOptInAssetParams = {
    to: string, 
    from: string,
    assetIndex: number,
    extras: any
}

export type TransferAssetParams = {
    to: string,
    from: string,
    amount?: number | bigint,
    note?: Uint8Array | undefined,
    assetIndex: number,
    extras?: any
}

export type MakeTransferAssetParams = {
    to: string,
    from: string,
    amount: number | bigint,
    note: Uint8Array | undefined,
    assetIndex: number,
    extras: any
}

export type CreatePaymentParams = {
    to: string, 
    from?: string,
    amount?: number | bigint,
    note?: string,
    extras?: any
}

export type MakePaymentParams = {
    to: string, 
    from: string,
    amount: number | bigint,
    note: string,
    extras: any
}

export type ChallengeParams = {
    domain: string,
    statement: string,
    address: string,
    uri: string,
    version?: string,
    chainId?: string,
    issuedAt?: string,
    expirationDate?: string,
    notBefore?: string,
    resources?: string[]
}
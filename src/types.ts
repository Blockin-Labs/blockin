interface IGetPublicKey {
    (address: string): string
}

interface IGetAccountInfo {
    (address: string): Promise<Record<string, any>>
}

interface IGetStatus {
    (): Promise<Record<string, any>>
}

interface IGetBlock {
    (nonce: number): Promise<Record<string, any>>
}

interface IGetAssetIndex {
    (txId: string): Promise<any>
}

interface IGetTransactionParams {
    (): Promise<any>
}

interface IGetUnsignedTxnAsStr {
    (txn: any): string
}

interface ICheckAddress {
    (address: string): boolean
}

interface ISendTx {
    (stxs: Uint8Array | Uint8Array[]): Promise<any>
}

interface ICreateTxn {
    (assetParams: CreateAssetParamsType): Promise<any>
}

interface IMakePaymentTxn {
    (from: string, to: string, amount: number | bigint, note: string): Promise<any>
}

interface IMakeAssetOptInTxn {
    (assetParams: OptInAssetParamsType): Promise<any>
}

interface IMakeAssetTransferTxn {
    (assetParams: TransferAssetParamsType): Promise<any>
}

interface IGetOriginalSignature {
    (txn: any): Promise<Uint8Array>
}

interface IGetSignature {
    (txn: any, message: string, result: Array<string | null>): Promise<Buffer | undefined>
}

interface IIsValidAddress {
    (address: string): boolean
}

interface IDecodeAddressGetPubKey {
    (address: string): Uint8Array
}
export interface IClient {
    server: string,
    indexServer: string,
    port: string,
    token: any,
    client: any,
    indexer: any,
    getPublicKey: IGetPublicKey,
    getAccountInfo: IGetAccountInfo,
    getStatus: IGetStatus,
    getBlock: IGetBlock,
    getAssetIndex: IGetAssetIndex,
    getTransactionParams: IGetTransactionParams,
    getUnsignedTxnAsStr: IGetUnsignedTxnAsStr
    checkAssress: ICheckAddress,
    sendTx: ISendTx,
    createTxn: ICreateTxn,
    makePaymentTxn: IMakePaymentTxn,
    makeAssetOptInTxn: IMakeAssetOptInTxn,
    makeAssetTransferTxn: IMakeAssetTransferTxn,
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

// Define required params and allow for extra params
export type CreateAssetParamsType = {
    to: string, 
    total: number, 
    decimals: number,
    assetName: string, 
    unitName: string, 
    assetURL: string, 
    assetMetadataHash: string | Uint8Array, 
    extras?: any
}

export type OptInAssetParamsType = {
    to: string,
    assetIndex: number,
    amount?: number | bigint,
    note?: Uint8Array | undefined,
}

export type TransferAssetParamsType = {
    to: string,
    from: string,
    closeRemainderTo: string | undefined,
    revocationTarget: string | undefined,
    amount: number | bigint,
    note: Uint8Array | undefined,
    assetIndex: number,
    extras: any
}
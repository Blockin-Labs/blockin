export type UniversalTxn = {
    txn: Uint8Array;
    message: string;
    txnId: string,
    nativeTxn: any
}

interface IMakeAssetTxn { (assetParams: MakeAssetParams): Promise<UniversalTxn> }
interface IMakeAssetOptInTxn { (assetParams: MakeOptInAssetParams): Promise<UniversalTxn> }
interface IMakeAssetTransferTxn { (assetParams: MakeTransferAssetParams): Promise<UniversalTxn> }
interface ISendTx { (stx: Uint8Array | Uint8Array[], txnId: string): Promise<any> }
interface IGetAssets { (address: string): Promise<any> }
interface IGetLastBlockIndex { (): Promise<any> }
interface IGetTimestampForBlock { (blockIndex: string): Promise<any> }
interface IIsValidAddress { (address: string): boolean }
interface IGetPublicKey { (address: string): Uint8Array }
interface IGetAssetDetails { (txnId: string): Promise<any> }
interface ILookupTransactionById { (txnId: string): Promise<any> }
interface IGetChallengeStringFromBytesToSign { (originalBytes: Uint8Array): Promise<string> }
interface IVerifySignature { (bytesToSign: Uint8Array, signedBytes: Uint8Array, address: string): Promise<void> }
interface IVerifyOwnershipOfAssets { (address: string, assetIds: string[], assetMinimumBalancesMap?: any, defaultMinimum?: number): Promise<any> }

export interface IChainDriver {
    server: string,
    indexerServer: string,
    port: string,
    token: any,
    client: any,
    indexer: any,
    getChallengeStringFromBytesToSign: IGetChallengeStringFromBytesToSign,
    makeAssetTxn: IMakeAssetTxn,
    makeAssetOptInTxn: IMakeAssetOptInTxn,
    makeAssetTransferTxn: IMakeAssetTransferTxn,
    sendTxn: ISendTx,
    getLastBlockIndex: IGetLastBlockIndex,
    getAllAssetsForAddress: IGetAssets,
    getTimestampForBlock: IGetTimestampForBlock,
    isValidAddress: IIsValidAddress,
    getPublicKeyFromAddress: IGetPublicKey,
    getAssetDetails: IGetAssetDetails,
    lookupTransactionById: ILookupTransactionById,
    verifySignature: IVerifySignature,
    verifyOwnershipOfAssets: IVerifyOwnershipOfAssets,
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
    assetMetadata: string,
    extras: any
}

export type MakeOptInAssetParams = {
    to: string,
    from: string,
    assetIndex: number,
    extras: any
}

export type MakeTransferAssetParams = {
    to: string,
    from: string,
    amount: number | bigint,
    note: Uint8Array | undefined,
    assetIndex: number,
    extras: any
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
    issuedAt?: string,
    version?: string,
    chainId?: string,
    expirationDate?: string,
    notBefore?: string,
    resources?: string[]
}
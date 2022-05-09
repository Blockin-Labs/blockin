export type UniversalTxn = {
    txn: Uint8Array;
    message: string;
    txnId: string,
    nativeTxn: any
}

interface IMakeAssetTxn { (assetParams: MakeAssetParams): Promise<UniversalTxn> }
interface IMakeAssetOptInTxn { (assetParams: MakeOptInAssetParams): Promise<UniversalTxn> }
interface IMakeContractOptInTxn { (appParams: MakeContractOptInParams): Promise<UniversalTxn>}
interface IMakeContractNoOpTxn { (appParams: MakeContractNoOpParams): Promise<UniversalTxn>}
interface ILookupApplicationLocalState { (address: string): Promise<any> }
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

/**
 * This interface attempts to define all the chain-specific functionality needed for this library.
 * Any blockchain that wants to use Blockin will implement this interface with its own custom logic.
 * 
 * All chain-specific functions depend on a valid chain driver being set. We export some already 
 * implemented ChainDriver classes from this library for your convenience. You may also choose to implement
 * your own. 
 * 
 * For example in Blockin's sample demo site, we call setDriver(new AlgoDriver('Mainnet', API_KEY)), and
 * once this is called, all other functions will use the implemented functions for Algorand defined
 * in AlgoDriver
 */
export interface IChainDriver {
    getChallengeStringFromBytesToSign: IGetChallengeStringFromBytesToSign,
    makeAssetTxn: IMakeAssetTxn,
    makeAssetOptInTxn: IMakeAssetOptInTxn,
    makeContractOptInTxn: IMakeContractOptInTxn,
    makeContractNoOpTxn: IMakeContractNoOpTxn,
    lookupApplicationLocalState: ILookupApplicationLocalState,
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

export type MakeContractOptInParams = {
    from: string,
    appIndex: number,
    extras: any
}

export type MakeContractNoOpParams = {
    from: string,
    appIndex: number,
    appArgs: Uint8Array[] | undefined,
    accounts: string[] | undefined,
    foreignAssets: number[] | undefined
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

/**
 * Interface for EIP-4361 Challenge - Sign in With Ethereum
 * 
 * For more information and documentation, view the EIP proposal.
 * 
 * Note that we support prefixing resources with 'Asset ID: ' as well.
 */
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
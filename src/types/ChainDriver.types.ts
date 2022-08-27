import { CreateAssetParams, CreateTransferAssetParams } from "./auth.types.js";

export type UniversalTxn = {
    txn: Uint8Array;
    message: string;
    txnId: string,
    nativeTxn: any
}

interface IMakeAssetTxn { (assetParams: CreateAssetParams): Promise<UniversalTxn> }
interface IMakeAssetTransferTxn { (assetParams: CreateTransferAssetParams): Promise<UniversalTxn> }
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
interface IVerifyOwnershipOfAssets {
    (address: string, resources: string[], assetMinimumBalancesRequiredMap?: any, defaultMinimum?: number): Promise<any>
}

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
    /**
     * Prepares the challenge string to be signed. Often used to prefix before signing. To reverse this
     * prefix and just get the challenge string during verification, use getChallengeStringFromBytesToSign().
     */
    // prepareChallengeStringToSign: IPrepareBytesToSign,
    /**
     * Parses the challenge string from the original signed bytes. Often used because chain's signature algorithms
     * add prefixes to strings before signing them. This reverses that.
     */
    parseChallengeStringFromBytesToSign: IGetChallengeStringFromBytesToSign,
    /**
     * Creates an authorization asset on-chain.
     */
    makeAssetTxn: IMakeAssetTxn,
    /**
     * Transfers an asset to a specified address. Asset must be transferable.
     */
    makeAssetTransferTxn: IMakeAssetTransferTxn,
    /**
     * Sends a signed transaction to the blockchain network
     */
    sendTxn: ISendTx,
    /**
     * Gets the last block hash or index.
     */
    getLastBlockIndex: IGetLastBlockIndex,
    /**
     * Gets all asset data for an address. Be cautious when using this. It may be more 
     * efficient to query address' balances for each asset individually.
     */
    getAllAssetsForAddress: IGetAssets,
    /**
     * Gets the latest block's timestamp.
     */
    getTimestampForBlock: IGetTimestampForBlock,
    /**
     * Checks if an address is well-formed.
     */
    isValidAddress: IIsValidAddress,
    /**
     * Gets the public key from an address
     */
    getPublicKeyFromAddress: IGetPublicKey,
    /**
     * Gets the metadata about a specific asset
     */
    getAssetDetails: IGetAssetDetails,
    /**
     * Gets the metadata about a specific transaction ID
     */
    lookupTransactionById: ILookupTransactionById,
    /**
     * Verifies a signature is signed correctly by an address
     */
    verifySignature: IVerifySignature,
    /**
     * Verifies user owns enough of certain assets by querying the public blockchain.
     * 
     * Note that resources can be either URIs or prefixed with 'Asset ID: '. This implementation
     * must parse and only look at the assets, not URIs.
     * 
     * Verifies an address owns enough of all specified resources. Should ignore every resource that 
     * doesn't start with 'Asset ID: '. Defaults to succeeding if user has a balance of >= 1 for every asset.
     * 
     * assetMinimumBalancesRequiredMap is optional, but here, one can define a JSON object mapping of 
     * 'assetIDs' => minimumBalances. If assetMinimumBalancesRequiredMap[assetId] exists, it will check 
     * that the user owns more than the specified minimum balance. If not defined, will use the default.
     * 
     * defaultMinimum is optional, but here, you can specify a new default minimum for all assets to 
     * fallback on if not defined in assetMinimumBalancesRequiredMap. Default is normally set to check if 
     * user owns >= 1.
     */
    verifyOwnershipOfAssets: IVerifyOwnershipOfAssets,
}
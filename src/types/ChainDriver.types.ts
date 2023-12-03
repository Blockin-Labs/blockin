import { CreateAssetParams, CreateTransferAssetParams } from "./auth.types.js";
import { Asset, NumberType } from "./verify.types.js";

export type UniversalTxn = {
  txn: Uint8Array;
  message: string;
  txnId: string,
  nativeTxn: any
}

export interface IMakeAssetTxn { (assetParams: CreateAssetParams): Promise<UniversalTxn> }
export interface IMakeAssetTransferTxn { (assetParams: CreateTransferAssetParams): Promise<UniversalTxn> }
export interface ISendTx { (stx: Uint8Array | Uint8Array[], txnId: string): Promise<any> }
export interface IGetAssets { (address: string): Promise<any> }
export interface IGetLastBlockIndex { (): Promise<any> }
export interface IGetTimestampForBlock { (blockIndex: string): Promise<any> }
export interface IIsValidAddress { (address: string): boolean }
export interface IGetPublicKey { (address: string): Uint8Array }
export interface IGetAssetDetails { (txnId: string): Promise<any> }
export interface ILookupTransactionById { (txnId: string): Promise<any> }
export interface IGetChallengeStringFromBytesToSign { (originalBytes: Uint8Array): Promise<string> }
export interface IVerifySignature { (message: string, signature: string): Promise<void> }
export interface IVerifyAssets<T extends NumberType> {
  (address: string, resources: string[], assets: Asset<T>[], balancesSnapshot?: object): Promise<any>
}

/**
 * This interface extends the IChainDriver interface with some helper functions that are useful for
 * signing and verifying challenges and other miscellaneous functions.
 */
export interface IChainDriverWithHelpers<T extends NumberType> extends IChainDriver<T> {
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
export interface IChainDriver<T extends NumberType> {
  /**
   * Checks if an address is well-formed.
   */
  isValidAddress: IIsValidAddress,


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
  verifyAssets: IVerifyAssets<T>,
}
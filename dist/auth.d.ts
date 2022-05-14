import { IChainDriver, UniversalTxn } from './@types/ChainDriver';
import { CreateAssetParams, CreateTransferAssetParams } from "./@types/auth";
export declare function initializeAuth(driver: IChainDriver): void;
/**
 * This function attempts to create a universal function that will create an asset on-chain. This
 * uses the chain driver, so it is chain specific. Generates an unsigned asset creation transaction,
 * and this is to be signed and broadcasted to the blockchain network. Note this may
 * need an API key defined in your chain driver depending on your chain driver implementation.
 * @param createAssetParams - JSON object specifying universal asset creation fields like from, amount,
 * decimals, etc.
 * @returns If successful, will return a UniversalTxn object that specifies the bytes to sign and submit
 * to create a valid asset creation transaction. Throws upon error.
 */
export declare function createAssetTxn(createAssetParams: CreateAssetParams): Promise<UniversalTxn>;
/**
 * This function attempts to create a universal function that will transfer an asset. This
 * uses the chain driver, so it is chain specific. Note that the asset must be transferable for this to work.
 * This generates an unsigned asset transfer transaction, and this is to be signed and broadcasted to
 * the blockchain network. Note this may need an API key defined in your chain driver depending on your
 * chain driver implementation.
 * @param transferAssetParams - JSON object specifying universal asset transfer fields such as the assetIndex
 * and the 'to' address
 * @returns If successful, will return a UniversalTxn object that specifies the bytes to sign and submit
 * to create a valid asset transfer transaction. Throws upon error.
 */
export declare function createAssetTransferTxn(transferAssetParams: CreateTransferAssetParams): Promise<UniversalTxn>;
/**
 * Sends a signed transaction to the network. Specific to the specified chain driver. Note this may
 * need an API key defined in your chain driver depending on your chain driver implementation.
 * @param signedTxnBytes - Uint8Array of the signed transaction bytes.
 * @param txnId - Transaction ID string
 * @returns Throws on error. If successful, will not throw. May return any metadata depending on chain
 * driver implementation.
 */
export declare function sendTxn(signedTxnBytes: Uint8Array | Uint8Array[], txnId: string): Promise<any>;

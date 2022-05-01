import { IChainDriver } from './@types/ChainDriver';
import { CreateAssetParams, CreateOptInAssetParams, CreateTransferAssetParams } from "./@types/auth";
export declare function initializeAuth(driver: IChainDriver): void;
/**
 * Generates an unsigned asset creation transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset creation transaction
 */
export declare function createAssetTxn(createAssetParams: CreateAssetParams): Promise<any>;
/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset opt-in transaction
 */
export declare function createAssetOptInTxn(optInAssetParams: CreateOptInAssetParams): Promise<any>;
/**
 * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset transfer transaction
 */
export declare function createAssetTransferTxn(transferAssetParams: CreateTransferAssetParams): Promise<any>;
export declare function sendTxn(stx: Uint8Array): Promise<any>;

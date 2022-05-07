import algosdk from 'algosdk';
import { IChainDriver, MakeAssetParams, MakeOptInAssetParams, MakePaymentParams, MakeTransferAssetParams, UniversalTxn } from '../@types/ChainDriver';
export declare class AlgoDriver implements IChainDriver {
    server: string;
    indexerServer: string;
    port: string;
    token: any;
    client: algosdk.Algodv2;
    indexer: algosdk.Indexer;
    constructor(API_KEY?: string);
    makeAssetTxn(assetParams: MakeAssetParams): Promise<UniversalTxn>;
    makePaymentTxn(assetParams: MakePaymentParams): Promise<UniversalTxn>;
    makeAssetOptInTxn(assetParams: MakeOptInAssetParams): Promise<UniversalTxn>;
    makeAssetTransferTxn(assetParams: MakeTransferAssetParams): Promise<UniversalTxn>;
    sendTxn(signedTxnResult: any, txnId: string): Promise<any>;
    getChallengeStringFromBytesToSign(txnBytes: Uint8Array): Promise<string>;
    lookupTransactionById(txnId: string): Promise<Record<string, any>>;
    getAssetDetails(assetId: string | Number): Promise<any>;
    getAllAssetsForAddress(address: string): Promise<any>;
    getStatus(): Promise<Record<string, any>>;
    getBlockTimestamp(nonce: number): Promise<string>;
    getTransactionParams(): Promise<Record<string, any>>;
    isValidAddress(address: string): boolean;
    getPublicKeyFromAddress(address: string): Uint8Array;
    verifySignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string): Promise<void>;
    verifyOwnershipOfAssets(address: string, assetIds: string[], assetMinimumBalancesMap?: any, defaultMinimum?: number): Promise<void>;
    private createUniversalTxn;
}

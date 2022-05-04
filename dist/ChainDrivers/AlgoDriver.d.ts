import algosdk from 'algosdk';
import { IChainDriver, MakeAssetParams, MakeOptInAssetParams, MakePaymentParams, MakeTransferAssetParams, UniversalTxn } from '../@types/ChainDriver';
export declare class AlgoDriver implements IChainDriver {
    server: string;
    indexerServer: string;
    port: string;
    token: any;
    client: algosdk.Algodv2;
    indexer: algosdk.Indexer;
    constructor(API_KEY: string);
    makeAssetTxn(assetParams: MakeAssetParams): Promise<UniversalTxn>;
    makePaymentTxn(assetParams: MakePaymentParams): Promise<UniversalTxn>;
    makeAssetOptInTxn(assetParams: MakeOptInAssetParams): Promise<UniversalTxn>;
    makeAssetTransferTxn(assetParams: MakeTransferAssetParams): Promise<UniversalTxn>;
    sendTxn(signedTxnResult: any, txnId: string): Promise<any>;
    lookupTransactionById(txnId: string): Promise<Record<string, any>>;
    getAssetDetails(assetId: string | Number): Promise<any>;
    getAssets(address: string): Promise<any>;
    getStatus(): Promise<Record<string, any>>;
    getBlockTimestamp(nonce: number): Promise<string>;
    getTransactionParams(): Promise<Record<string, any>>;
    isValidAddress(address: string): boolean;
    getPublicKey(address: string): Uint8Array;
    private createUniversalTxn;
}

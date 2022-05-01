import algosdk, { Transaction } from 'algosdk';
import { IChainDriver, MakeAssetParams, MakeOptInAssetParams, MakePaymentParams, MakeTransferAssetParams } from '../@types/ChainDriver';
export declare class AlgoDriver implements IChainDriver {
    server: string;
    indexerServer: string;
    port: string;
    token: any;
    client: algosdk.Algodv2;
    indexer: algosdk.Indexer;
    constructor();
    makeAssetTxn(assetParams: MakeAssetParams): Promise<algosdk.Transaction>;
    makePaymentTxn(assetParams: MakePaymentParams): Promise<algosdk.Transaction>;
    makeAssetOptInTxn(assetParams: MakeOptInAssetParams): Promise<{
        txn: string;
        message: string;
    }[][]>;
    makeAssetTransferTxn(assetParams: MakeTransferAssetParams): Promise<algosdk.Transaction>;
    sendTxn(stx: Uint8Array): Promise<any>;
    getAssets(address: string): Promise<any>;
    getStatus(): Promise<Record<string, any>>;
    getBlockTimestamp(nonce: number): Promise<string>;
    getTransactionParams(): Promise<Record<string, any>>;
    isValidAddress(address: string): boolean;
    getPublicKey(address: string): Uint8Array;
    convertTxnToStr(txn: Transaction): string;
}

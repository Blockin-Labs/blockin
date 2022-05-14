import algosdk from 'algosdk';
import { CreateAssetParams, CreateTransferAssetParams } from '../@types/auth';
import { IChainDriver, UniversalTxn } from '../@types/ChainDriver';
declare type CreateContractOptInParams = {
    from: string;
    appIndex: number;
    extras?: any;
};
declare type CreateContractNoOpParams = {
    from: string;
    appIndex: number;
    appArgs: Uint8Array[] | undefined;
    accounts: string[] | undefined;
    foreignAssets: number[] | undefined;
};
/**
 * Universal type for any chain's opt-in to asset transaction parameters.
 */
declare type CreateOptInAssetParams = {
    to: string;
    from?: string;
    assetIndex: number;
    extras?: any;
};
declare type CreatePaymentParams = {
    to: string;
    from?: string;
    amount?: number | bigint;
    note?: string;
    extras?: any;
};
/**
 * Algorand implementation of the IChainDriver interface. This implementation is based off the algoSdk
 * npm library. Another backbone of this implementation is the PureStake API.
 *
 * If you would like to use an alternative API, you must set this.client and this.indexer to valid
 * algosdk.Algodv2 and algosdk.Indexer respectively. The constructor takes two arguments: first,
 * you specify 'Mainnet' or 'Testnet', and second, you input your Purestake API key.
 *
 * For documentation regarding what each function does, see the IChainDriver interface.
 *
 * Note that the Blockin library also has many convenient, chain-generic functions that implement
 * this logic for creating / verifying challenges. You will have to setChainDriver(new AlgoDriver(.....)) first.
 */
export declare class AlgoDriver implements IChainDriver {
    server: string;
    indexerServer: string;
    port: string;
    token: any;
    client: algosdk.Algodv2;
    indexer: algosdk.Indexer;
    constructor(chain: 'Mainnet' | 'Testnet', API_KEY?: string);
    makeAssetTxn(assetParams: CreateAssetParams): Promise<UniversalTxn>;
    makePaymentTxn(assetParams: CreatePaymentParams): Promise<UniversalTxn>;
    makeContractOptInTxn(appParams: CreateContractOptInParams): Promise<UniversalTxn>;
    makeContractNoOpTxn(appParams: CreateContractNoOpParams): Promise<UniversalTxn>;
    makeAssetOptInTxn(assetParams: CreateOptInAssetParams): Promise<UniversalTxn>;
    makeAssetTransferTxn(assetParams: CreateTransferAssetParams): Promise<UniversalTxn>;
    sendTxn(signedTxnResult: any, txnId: string): Promise<any>;
    getChallengeStringFromBytesToSign(txnBytes: Uint8Array): Promise<string>;
    lookupApplicationLocalState(address: string): Promise<Record<string, any>>;
    lookupTransactionById(txnId: string): Promise<Record<string, any>>;
    getAssetDetails(assetId: string | Number): Promise<any>;
    getAllAssetsForAddress(address: string): Promise<any>;
    getLastBlockIndex(): Promise<string>;
    getTimestampForBlock(blockIndexStr: string): Promise<string>;
    getTransactionParams(): Promise<Record<string, any>>;
    getSuggestedParams(): Promise<algosdk.SuggestedParams>;
    isValidAddress(address: string): boolean;
    getPublicKeyFromAddress(address: string): Uint8Array;
    verifySignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string): Promise<void>;
    verifyOwnershipOfAssets(address: string, assetIds: string[], assetMinimumBalancesMap?: any, defaultMinimum?: number): Promise<{
        assetsForAddress: any;
        address: string;
    } | undefined>;
    private createUniversalTxn;
}
export {};

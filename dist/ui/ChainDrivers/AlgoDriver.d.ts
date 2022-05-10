import algosdk from 'algosdk';
import { IChainDriver, MakeAssetParams, MakeOptInAssetParams, MakeContractOptInParams, MakeContractNoOpParams, MakePaymentParams, MakeTransferAssetParams, UniversalTxn } from '../@types/ChainDriver';
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
    makeAssetTxn(assetParams: MakeAssetParams): Promise<UniversalTxn>;
    makePaymentTxn(assetParams: MakePaymentParams): Promise<UniversalTxn>;
    makeContractOptInTxn(appParams: MakeContractOptInParams): Promise<UniversalTxn>;
    makeContractNoOpTxn(appParams: MakeContractNoOpParams): Promise<UniversalTxn>;
    makeAssetOptInTxn(assetParams: MakeOptInAssetParams): Promise<UniversalTxn>;
    makeAssetTransferTxn(assetParams: MakeTransferAssetParams): Promise<UniversalTxn>;
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
    }>;
    private createUniversalTxn;
}

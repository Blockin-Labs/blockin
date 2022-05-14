import algosdk, { decodeAddress, Transaction } from 'algosdk';
import nacl from 'tweetnacl';
import { CreateAssetParams, CreateTransferAssetParams } from '../@types/auth';
import { IChainDriver, UniversalTxn } from '../@types/ChainDriver'

type CreateContractOptInParams = {
    from: string,
    appIndex: number,
    extras?: any
}

type CreateContractNoOpParams = {
    from: string,
    appIndex: number,
    appArgs: Uint8Array[] | undefined,
    accounts: string[] | undefined,
    foreignAssets: number[] | undefined
}

/**
 * Universal type for any chain's opt-in to asset transaction parameters. 
 */
type CreateOptInAssetParams = {
    to: string,
    from?: string,
    assetIndex: number,
    extras?: any
}

type CreatePaymentParams = {
    to: string,
    from?: string,
    amount?: number | bigint,
    note?: string,
    extras?: any
}


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
export class AlgoDriver implements IChainDriver {
    server: string = "https://testnet-algorand.api.purestake.io/ps2";
    indexerServer: string = "https://testnet-algorand.api.purestake.io/idx2";
    port: string = "";
    token: any = {};
    client: algosdk.Algodv2;
    indexer: algosdk.Indexer;

    constructor(chain: 'Mainnet' | 'Testnet', API_KEY?: string) {
        this.token = { "x-api-key": API_KEY ? API_KEY : '' }
        if (chain == 'Mainnet') {
            this.server = "https://mainnet-algorand.api.purestake.io/ps2";
            this.indexerServer = "https://mainnet-algorand.api.purestake.io/idx2";
        }
        this.client = new algosdk.Algodv2(this.token, this.server, this.port);
        this.indexer = new algosdk.Indexer(this.token, this.indexerServer, this.port);
    }

    async makeAssetTxn(assetParams: CreateAssetParams) {
        const {
            from,
            to,
            assetName,
            assetURL,
            note,
            amount,
            unitName,
            decimals,
            total,
            assetMetadata,
            extras = {
                defaultFrozen: false,
                clawback: from,
                freeze: from,
                manager: from,
                reserve: from
            }
        } = assetParams
        // Hash the metadata
        // const metaDataBuffer = new TextEncoder().encode(assetMetadata);    // encode as UTF-8  
        // const metaDataHashBuffer = await subtle.digest('SHA-256', metaDataBuffer);    // hash the message
        // const hashedMetaData = new Uint8Array(metaDataHashBuffer);   // Convert ArrayBuffer to Array
        const suggestedParams = await this.getTransactionParams()
        const algoTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from,
            to,
            assetName,
            assetURL,
            note: new TextEncoder().encode(note),
            amount,
            unitName,
            decimals,
            total,
            // assetMetadataHash: hashedMetaData,
            assetMetadataHash: assetMetadata,
            suggestedParams,
            ...extras
        })
        return this.createUniversalTxn(algoTxn, `Sign this txn to create asset ${assetName}`)
    }

    async makePaymentTxn(assetParams: CreatePaymentParams) {
        const {
            to,
            from,
            amount,
            note,
            extras
        } = assetParams

        const suggestedParams = await this.getTransactionParams()
        const algoTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from,
            to,
            amount,
            note: note ? new Uint8Array(Buffer.from(note)) : new Uint8Array(Buffer.from('')),
            suggestedParams,
            ...extras
        })
        return this.createUniversalTxn(algoTxn, `Sign this txn to make a payment of ${amount} algos to ${to}`)
    }

    async makeContractOptInTxn(appParams: CreateContractOptInParams) {
        const {
            from,
            appIndex,
            extras = {
                amount: 0,
                note: undefined,
                closeRemainderTo: undefined,
                revocationTarget: undefined
            }
        } = appParams

        const suggestedParams = await this.getSuggestedParams()

        const algoTxn = algosdk.makeApplicationOptInTxn(from, suggestedParams, appIndex)
        return this.createUniversalTxn(algoTxn, `Sign this txn to opt-in to contract ${appIndex} from ${from}`)
    }

    async makeContractNoOpTxn(appParams: CreateContractNoOpParams) {
        const {
            from,
            appIndex,
            appArgs,
            accounts,
            foreignAssets,
        } = appParams

        const suggestedParams = await this.getSuggestedParams()

        const algoTxn = algosdk.makeApplicationNoOpTxn(from, suggestedParams, appIndex, appArgs, accounts, undefined, foreignAssets)
        return this.createUniversalTxn(algoTxn, `Sign this txn to call contract ${appIndex} from ${from}`)
    }

    async makeAssetOptInTxn(assetParams: CreateOptInAssetParams) {
        const {
            to,
            from,
            assetIndex,
            extras = {
                amount: 0,
                note: undefined,
                closeRemainderTo: undefined,
                revocationTarget: undefined
            }
        } = assetParams

        const suggestedParams = await this.getTransactionParams()
        const algoTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from,
            to,
            assetIndex,
            suggestedParams,
            ...extras
        });
        return this.createUniversalTxn(algoTxn, `Sign this txn to opt-in to receive asset ${assetIndex} from ${from}`)
    }

    async makeAssetTransferTxn(assetParams: CreateTransferAssetParams) {
        const {
            to,
            from,
            assetIndex,
            extras = {
                amount: 1,
                note: new TextEncoder().encode('Transfer this asset'),
                closeRemainderTo: undefined,
                revocationTarget: undefined
            }
        } = assetParams

        const suggestedParams = await this.getTransactionParams()
        const algoTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from,
            to,
            assetIndex,
            suggestedParams,
            ...extras
        });
        return this.createUniversalTxn(algoTxn, `Sign this txn to transfer asset ${assetIndex} to ${to}`)
    }

    async sendTxn(signedTxnResult: any, txnId: string): Promise<any> {
        // const txns: Uint8Array[] = signedTxnResult.map((element: any) => {
        //     return new Uint8Array(Buffer.from(element, "base64"))
        // })
        // const encodedStx = new TextEncoder().encode(stx)
        // const sentTxn = await this.client.sendRawTransaction(txns).do();
        const sentTxn = await this.client.sendRawTransaction(signedTxnResult).do();
        await algosdk.waitForConfirmation(this.client, txnId, 4);
        return sentTxn
    }

    async getChallengeStringFromBytesToSign(txnBytes: Uint8Array) {
        const txnString = new TextDecoder().decode(txnBytes);

        const bytes = [];
        let idx = txnString.indexOf('note') + 8;
        while (txnBytes[idx] !== 163) {
            bytes.push(txnBytes[idx]);
            idx++;
        }

        const challengeString = new TextDecoder().decode(new Uint8Array(bytes));

        return challengeString;
    }

    async lookupApplicationLocalState(address: string) {
        return this.indexer.lookupAccountAppLocalStates(address).do();
    }

    async lookupTransactionById(txnId: string) {
        const txnDetails = await this.indexer.lookupTransactionByID(txnId).do();
        return txnDetails;
    }

    async getAssetDetails(assetId: string | Number): Promise<any> {
        let accountInfo = (await this.client.getAssetByID(Number(assetId)).do());
        return accountInfo.params;
    }

    async getAllAssetsForAddress(address: string): Promise<any> {
        const accountInfo = await this.client.accountInformation(address).do();
        return accountInfo.assets
    }

    async getLastBlockIndex(): Promise<string> {
        let status = await this.client.status().do();
        return status['last-round'];
    }

    async getTimestampForBlock(blockIndexStr: string): Promise<string> {
        const blockIndex = Number(blockIndexStr);
        const blockData = await this.client.block(blockIndex).do();
        return blockData.block.ts
    }

    async getTransactionParams(): Promise<Record<string, any>> {
        return await this.client.getTransactionParams().do();
    }

    async getSuggestedParams(): Promise<algosdk.SuggestedParams> {
        return await this.client.getTransactionParams().do();
    }

    isValidAddress(address: string): boolean {
        return algosdk.isValidAddress(address)
    }

    getPublicKeyFromAddress(address: string): Uint8Array {
        return decodeAddress(address).publicKey;
    }

    async verifySignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string): Promise<void> {
        if (!nacl.sign.detached.verify(originalChallengeToUint8Array, signedChallenge, this.getPublicKeyFromAddress(originalAddress))) {
            throw 'Invalid signature';
        }
    }

    async verifyOwnershipOfAssets(address: string, assetIds: string[], assetMinimumBalancesMap?: any, defaultMinimum?: number) {
        if (!assetIds || assetIds.length == 0) return;

        let assets = (await this.getAllAssetsForAddress(address));

        const assetLookupData = {
            assetsForAddress: assets,
            address,
        };

        for (let i = 0; i < assetIds.length; i++) {
            const assetId = assetIds[i];
            const defaultBalance = defaultMinimum ? defaultMinimum : 1;
            const minimumAmount = assetMinimumBalancesMap && assetMinimumBalancesMap[assetId] ? assetMinimumBalancesMap[assetId] : defaultBalance;

            const requestedAsset = assets.find((elem: any) => elem['asset-id'].toString() === assetId);
            if (!requestedAsset) {
                throw `Address ${address} does not own requested asset : ${assetId}`;
            }
            console.log(`Success: Found asset in user's wallet: ${assetId}.`);
            console.log('ASSET DETAILS', requestedAsset);

            if (requestedAsset['amount'] < minimumAmount) {
                throw `Address ${address} only owns ${requestedAsset['amount']} and does not meet minimum balance requirement of ${minimumAmount} for asset : ${assetId}`;
            }
        }

        return assetLookupData;
    }

    private createUniversalTxn(algoTxn: Transaction, message: string): UniversalTxn {
        return {
            txn: algosdk.encodeUnsignedTransaction(algoTxn),
            message,
            txnId: algoTxn.txID().toString(),
            nativeTxn: algoTxn
        }
    }
}

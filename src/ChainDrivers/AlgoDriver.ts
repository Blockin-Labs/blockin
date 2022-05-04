import algosdk, { decodeAddress, Transaction } from 'algosdk';
import {
    IChainDriver,
    MakeAssetParams,
    MakeOptInAssetParams,
    MakePaymentParams,
    MakeTransferAssetParams,
    UniversalTxn
} from '../@types/ChainDriver'

export class AlgoDriver implements IChainDriver {
    server: string = "https://testnet-algorand.api.purestake.io/ps2";
    indexerServer: string = "https://testnet-algorand.api.purestake.io/idx2";
    port: string = "";
    token: any = {"x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy"};
    client: algosdk.Algodv2;
    indexer: algosdk.Indexer;

    constructor() {
        this.client = new algosdk.Algodv2(this.token, this.server, this.port);
        this.indexer = new algosdk.Indexer(this.token, this.indexerServer, this.port);
    }

    async makeAssetTxn(assetParams: MakeAssetParams) {
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

    async makePaymentTxn(assetParams: MakePaymentParams) {
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
            note: new Uint8Array(Buffer.from(note)),
            suggestedParams,
            ...extras
        })
        return this.createUniversalTxn(algoTxn, `Sign this txn to make a payment of ${amount} algos to ${to}`)
    }

    async makeAssetOptInTxn(assetParams: MakeOptInAssetParams) {
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

    async makeAssetTransferTxn(assetParams: MakeTransferAssetParams) {
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

    async getAssetDetails(assetId: string | Number): Promise<any> {
        let accountInfo = (await this.client.getAssetByID(Number(assetId)).do());
        return accountInfo.params;
    }

    async getAssets(address: string): Promise<any> {
        const accountInfo = await this.client.accountInformation(address).do();
        return accountInfo.assets
    }

    async getStatus(): Promise<Record<string, any>> {
        return await this.client.status().do();
    }

    async getBlockTimestamp(nonce: number): Promise<string> {
        const blockData = await this.client.block(nonce).do()
        return blockData.block.ts
    }

    async getTransactionParams(): Promise<Record<string, any>> {
        return await this.client.getTransactionParams().do();
    }

    isValidAddress(address: string): boolean {
        return algosdk.isValidAddress(address)
    }

    getPublicKey(address: string): Uint8Array {
        // const utfPublicKey = decodeAddress(address).publicKey
        // return new TextDecoder('utf-8').decode(utfPublicKey)
        return decodeAddress(address).publicKey
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

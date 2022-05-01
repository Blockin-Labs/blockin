import algosdk, { decodeAddress } from 'algosdk';
export class AlgoDriver {
    constructor() {
        this.server = "https://testnet-algorand.api.purestake.io/ps2";
        this.indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
        this.port = "";
        this.token = { "x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy" };
        this.client = new algosdk.Algodv2(this.token, this.server, this.port);
        this.indexer = new algosdk.Indexer(this.token, this.indexerServer, this.port);
    }
    async makeAssetTxn(assetParams) {
        const { from, to, assetName, assetURL, note, amount, unitName, decimals, total, assetMetadataHash, extras } = assetParams;
        // Hash the metadata
        const metaDataBuffer = new TextEncoder().encode(assetMetadataHash); // encode as UTF-8               
        const metaDataHashBuffer = await crypto.subtle.digest('SHA-256', metaDataBuffer); // hash the message
        const hashedMetaData = new Uint8Array(metaDataHashBuffer); // Convert ArrayBuffer to Array
        const suggestedParams = await this.getTransactionParams();
        const algoTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            assetName,
            assetURL, note: new TextEncoder().encode(note), amount,
            unitName,
            decimals,
            total, assetMetadataHash: hashedMetaData, suggestedParams }, extras));
        return this.createUniversalTxn(algoTxn, `Sign this txn to create asset ${assetName}`);
    }
    async makePaymentTxn(assetParams) {
        const { to, from, amount, note, extras } = assetParams;
        const suggestedParams = await this.getTransactionParams();
        const algoTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            amount, note: new Uint8Array(Buffer.from(note)), suggestedParams }, extras));
        return this.createUniversalTxn(algoTxn, `Sign this txn to make a payment of ${amount} algos to ${to}`);
    }
    async makeAssetOptInTxn(assetParams) {
        const { to, from, amount, assetIndex, extras } = assetParams;
        const suggestedParams = await this.getTransactionParams();
        const algoTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            amount,
            assetIndex,
            suggestedParams }, extras));
        return this.createUniversalTxn(algoTxn, `Sign this txn to opt-in to receive asset ${assetIndex} from ${from}`);
    }
    async makeAssetTransferTxn(assetParams) {
        const { to, from, amount, note, assetIndex, extras } = assetParams;
        const suggestedParams = await this.getTransactionParams();
        const algoTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            amount,
            note,
            assetIndex,
            suggestedParams }, extras));
        return this.createUniversalTxn(algoTxn, `Sign this txn to transfer asset ${assetIndex} to ${to}`);
    }
    async sendTxn(stx) {
        // const encodedStx = new TextEncoder().encode(stx)
        // return await this.client.sendRawTransaction(encodedStx).do();
        return await this.client.sendRawTransaction(stx).do();
    }
    async getAssets(address) {
        const accountInfo = await this.client.accountInformation(address).do();
        return accountInfo.assets;
    }
    async getStatus() {
        return await this.client.status().do();
    }
    async getBlockTimestamp(nonce) {
        const blockData = await this.client.block(nonce).do();
        return blockData.block.ts;
    }
    async getTransactionParams() {
        return await this.client.getTransactionParams().do();
    }
    isValidAddress(address) {
        return algosdk.isValidAddress(address);
    }
    getPublicKey(address) {
        // const utfPublicKey = decodeAddress(address).publicKey
        // return new TextDecoder('utf-8').decode(utfPublicKey)
        return decodeAddress(address).publicKey;
    }
    createUniversalTxn(algoTxn, message) {
        return {
            txn: Buffer.from(algosdk.encodeUnsignedTransaction(algoTxn)).toString("base64"),
            message
        };
    }
}

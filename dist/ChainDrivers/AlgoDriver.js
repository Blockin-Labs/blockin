import algosdk, { decodeAddress } from 'algosdk';
export class AlgoDriver {
    constructor() {
        this.server = "https://testnet-algorand.api.purestake.io/ps2";
        this.indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
        this.port = "";
        this.token = {
            "x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy"
        };
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
        return algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            assetName,
            assetURL, note: new TextEncoder().encode(note), amount,
            unitName,
            decimals,
            total, assetMetadataHash: hashedMetaData, suggestedParams }, extras));
    }
    async makePaymentTxn(assetParams) {
        const { to, from, amount, note, extras } = assetParams;
        const suggestedParams = await this.getTransactionParams();
        return algosdk.makePaymentTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            amount, note: new Uint8Array(Buffer.from(note)), suggestedParams }, extras));
    }
    async makeAssetOptInTxn(assetParams) {
        const { to, from, amount, assetIndex, extras } = assetParams;
        const suggestedParams = await this.getTransactionParams();
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            amount,
            assetIndex,
            suggestedParams }, extras));
        const signTxnObj = {
            txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64"),
            message: 'Description of transaction being signed'
        };
        return [[signTxnObj]];
    }
    async makeAssetTransferTxn(assetParams) {
        const { to, from, amount, note, assetIndex, extras } = assetParams;
        const suggestedParams = await this.getTransactionParams();
        return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            amount,
            note,
            assetIndex,
            suggestedParams }, extras));
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
    convertTxnToStr(txn) {
        return Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
    }
}

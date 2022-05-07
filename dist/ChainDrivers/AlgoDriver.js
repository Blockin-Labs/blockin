import algosdk, { decodeAddress } from 'algosdk';
import nacl from 'tweetnacl';
export class AlgoDriver {
    constructor(API_KEY) {
        this.server = "https://testnet-algorand.api.purestake.io/ps2";
        this.indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
        this.port = "";
        this.token = {};
        this.token = { "x-api-key": API_KEY ? API_KEY : '' };
        this.client = new algosdk.Algodv2(this.token, this.server, this.port);
        this.indexer = new algosdk.Indexer(this.token, this.indexerServer, this.port);
    }
    async makeAssetTxn(assetParams) {
        const { from, to, assetName, assetURL, note, amount, unitName, decimals, total, assetMetadata, extras = {
            defaultFrozen: false,
            clawback: from,
            freeze: from,
            manager: from,
            reserve: from
        } } = assetParams;
        // Hash the metadata
        // const metaDataBuffer = new TextEncoder().encode(assetMetadata);    // encode as UTF-8  
        // const metaDataHashBuffer = await subtle.digest('SHA-256', metaDataBuffer);    // hash the message
        // const hashedMetaData = new Uint8Array(metaDataHashBuffer);   // Convert ArrayBuffer to Array
        const suggestedParams = await this.getTransactionParams();
        const algoTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            assetName,
            assetURL, note: new TextEncoder().encode(note), amount,
            unitName,
            decimals,
            total, 
            // assetMetadataHash: hashedMetaData,
            assetMetadataHash: assetMetadata, suggestedParams }, extras));
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
        const { to, from, assetIndex, extras = {
            amount: 0,
            note: undefined,
            closeRemainderTo: undefined,
            revocationTarget: undefined
        } } = assetParams;
        const suggestedParams = await this.getTransactionParams();
        const algoTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            assetIndex,
            suggestedParams }, extras));
        return this.createUniversalTxn(algoTxn, `Sign this txn to opt-in to receive asset ${assetIndex} from ${from}`);
    }
    async makeAssetTransferTxn(assetParams) {
        const { to, from, assetIndex, extras = {
            amount: 1,
            note: new TextEncoder().encode('Transfer this asset'),
            closeRemainderTo: undefined,
            revocationTarget: undefined
        } } = assetParams;
        const suggestedParams = await this.getTransactionParams();
        const algoTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(Object.assign({ from,
            to,
            assetIndex,
            suggestedParams }, extras));
        return this.createUniversalTxn(algoTxn, `Sign this txn to transfer asset ${assetIndex} to ${to}`);
    }
    async sendTxn(signedTxnResult, txnId) {
        // const txns: Uint8Array[] = signedTxnResult.map((element: any) => {
        //     return new Uint8Array(Buffer.from(element, "base64"))
        // })
        // const encodedStx = new TextEncoder().encode(stx)
        // const sentTxn = await this.client.sendRawTransaction(txns).do();
        const sentTxn = await this.client.sendRawTransaction(signedTxnResult).do();
        await algosdk.waitForConfirmation(this.client, txnId, 4);
        return sentTxn;
    }
    async getChallengeStringFromBytesToSign(txnBytes) {
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
    async lookupTransactionById(txnId) {
        const txnDetails = await this.indexer.lookupTransactionByID(txnId).do();
        return txnDetails;
    }
    async getAssetDetails(assetId) {
        let accountInfo = (await this.client.getAssetByID(Number(assetId)).do());
        return accountInfo.params;
    }
    async getAllAssetsForAddress(address) {
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
    getPublicKeyFromAddress(address) {
        return decodeAddress(address).publicKey;
    }
    async verifySignature(originalChallengeToUint8Array, signedChallenge, originalAddress) {
        if (!nacl.sign.detached.verify(originalChallengeToUint8Array, signedChallenge, this.getPublicKeyFromAddress(originalAddress))) {
            throw 'Invalid signature';
        }
    }
    async verifyOwnershipOfAssets(address, assetIds, assetMinimumBalancesMap, defaultMinimum) {
        if (assetIds.length == 0)
            return;
        let assets = (await this.getAllAssetsForAddress(address));
        for (let i = 0; i < assetIds.length; i++) {
            const assetId = assetIds[i];
            const defaultBalance = defaultMinimum ? defaultMinimum : 1;
            const minimumAmount = assetMinimumBalancesMap && assetMinimumBalancesMap[assetId] ? assetMinimumBalancesMap[assetId] : defaultBalance;
            const requestedAsset = assets.find((elem) => elem['asset-id'].toString() === assetId);
            if (!requestedAsset) {
                throw `Address ${address} does not own requested asset : ${assetId}`;
            }
            console.log(`Success: Found asset in user's wallet: ${assetId}.`);
            console.log('ASSET DETAILS', requestedAsset);
            if (requestedAsset['amount'] < minimumAmount) {
                throw `Address ${address} only owns ${requestedAsset['amount']} and does not meet minimum balance requirement of ${minimumAmount} for asset : ${assetId}`;
            }
        }
    }
    createUniversalTxn(algoTxn, message) {
        return {
            txn: algosdk.encodeUnsignedTransaction(algoTxn),
            message,
            txnId: algoTxn.txID().toString(),
            nativeTxn: algoTxn
        };
    }
}

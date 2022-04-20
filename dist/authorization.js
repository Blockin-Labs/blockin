var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import algosdk from 'algosdk';
const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
const port = "";
const token = {
    "x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy" // fill in yours
};
/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @param receiverAddress
 * @param assetId
 * @returns an unsigned asset opt-in transaction
 */
export function makeAssetOptInTxn(receiverAddress, assetId) {
    return __awaiter(this, void 0, void 0, function* () {
        const algodClient = new algosdk.Algodv2(token, algodServer, port);
        const amount = 0;
        const params = yield algodClient.getTransactionParams().do();
        const closeRemainderTo = undefined;
        const revocationTarget = undefined;
        const note = undefined;
        // Create opt-in transaction (note that sender and receiver addresses are the same)
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(receiverAddress, receiverAddress, closeRemainderTo, revocationTarget, amount, note, assetId, params);
        return txn;
    });
}
export function signAssetOptInTxn(receiverAddress, assetId, sign) {
    return __awaiter(this, void 0, void 0, function* () {
        const algodClient = new algosdk.Algodv2(token, algodServer, port);
        const txns = [yield makeAssetOptInTxn(receiverAddress, assetId)];
        //get the tx signed, most likely using bound function
        const stxs = yield sign(txns);
        const sentTx = yield algodClient.sendRawTransaction(stxs).do();
        console.log("Transaction : " + sentTx.txId);
        console.log("Asset ID: " + "lookup asset id");
    });
}
/**
 * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
 * @param senderAddress
 * @param receiverAddress
 * @param assetId
 * @returns an unsigned asset transfer transaction
 */
export function makeAssetTransferTxn(senderAddress, receiverAddress, assetId) {
    return __awaiter(this, void 0, void 0, function* () {
        const algodClient = new algosdk.Algodv2(token, algodServer, port);
        const amount = 1;
        const params = yield algodClient.getTransactionParams().do();
        const closeRemainderTo = undefined;
        const revocationTarget = undefined;
        const note = undefined;
        // Create asset transfer transaction
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(senderAddress, receiverAddress, closeRemainderTo, revocationTarget, amount, note, assetId, params);
        return txn;
    });
}
/**
 * Generates an unsigned asset creation transaction, to be signed and sent to the algorand network
 * @param senderAddress
 * @param assetName
 * @param unitName
 * @param total
 * @param assetURL
 * @param assetMetadataHash
 * @param defaultFrozen
 * @param clawbackAddr
 * @returns an unsigned asset creation transaction
 */
export function makeAssetCreateTxn(senderAddress, assetName, unitName, total, assetURL, assetMetadataHash, defaultFrozen = false, clawbackAddr = senderAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const algodClient = new algosdk.Algodv2(token, algodServer, port);
        const decimals = 0;
        const suggestedParams = yield algodClient.getTransactionParams().do();
        const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from: senderAddress,
            total,
            decimals,
            assetName,
            unitName,
            assetURL,
            assetMetadataHash,
            defaultFrozen,
            freeze: senderAddress,
            manager: senderAddress,
            clawback: clawbackAddr,
            reserve: senderAddress,
            suggestedParams,
        });
        return txn;
    });
}
export function txIdToAssetId(txId) {
    return __awaiter(this, void 0, void 0, function* () {
        const indexerClient = new algosdk.Indexer(token, indexerServer, port);
        const foundTx = yield indexerClient.lookupTransactionByID(txId).do();
        return foundTx.assetIndex;
    });
}
export function signAssetCreateTxn(senderAddress, assetMetadataHash, sign) {
    return __awaiter(this, void 0, void 0, function* () {
        const algodClient = new algosdk.Algodv2(token, algodServer, port);
        const txns = [yield makeAssetCreateTxn(senderAddress, "Blockin", "AUTH", 1, "blockin", assetMetadataHash)];
        //get the tx signed, most likely using bound function
        const stxs = yield sign(txns);
        const sentTx = yield algodClient.sendRawTransaction(stxs).do();
        console.log("Transaction : " + sentTx.txId);
        console.log("Asset ID: " + "lookup asset id");
    });
}

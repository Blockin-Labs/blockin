"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAssetCreateTxn = exports.makeAssetTransferTxn = exports.makeAssetOptInTxn = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";
const port = "";
const token = {
    "x-api-key": "secret_sauce" // fill in yours
};
const algodClient = new algosdk_1.default.Algodv2(token, algodServer, port);
const indexerClient = new algosdk_1.default.Indexer(token, indexerServer, port);
/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @param receiverAddress
 * @param assetId
 * @returns an unsigned asset opt-in transaction
 */
function makeAssetOptInTxn(receiverAddress, assetId) {
    return __awaiter(this, void 0, void 0, function* () {
        const amount = 0;
        const params = yield algodClient.getTransactionParams().do();
        const closeRemainderTo = undefined;
        const revocationTarget = undefined;
        const note = undefined;
        // Create opt-in transaction (note that sender and receiver addresses are the same)
        const txn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParams(receiverAddress, receiverAddress, closeRemainderTo, revocationTarget, amount, note, assetId, params);
        return txn;
    });
}
exports.makeAssetOptInTxn = makeAssetOptInTxn;
/**
 * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
 * @param senderAddress
 * @param receiverAddress
 * @param assetId
 * @returns an unsigned asset transfer transaction
 */
function makeAssetTransferTxn(senderAddress, receiverAddress, assetId) {
    return __awaiter(this, void 0, void 0, function* () {
        const amount = 1;
        const params = yield algodClient.getTransactionParams().do();
        const closeRemainderTo = undefined;
        const revocationTarget = undefined;
        const note = undefined;
        // Create asset transfer transaction
        const txn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParams(senderAddress, receiverAddress, closeRemainderTo, revocationTarget, amount, note, assetId, params);
        return txn;
    });
}
exports.makeAssetTransferTxn = makeAssetTransferTxn;
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
function makeAssetCreateTxn(senderAddress, assetName, unitName, total, assetURL, assetMetadataHash, defaultFrozen = false, clawbackAddr = senderAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const decimals = 0;
        const suggestedParams = yield algodClient.getTransactionParams().do();
        const txn = algosdk_1.default.makeAssetCreateTxnWithSuggestedParamsFromObject({
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
exports.makeAssetCreateTxn = makeAssetCreateTxn;

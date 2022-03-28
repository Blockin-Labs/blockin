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
exports.verifyChallenge = exports.createChallenge = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const URI_REGEX = /\w+:(\/?\/?)[^\s]+/;
const ISO8601_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
const server = "https://testnet-algorand.api.purestake.io/ps2";
const port = "";
const token = {
    "x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy"
};
let client = new algosdk_1.default.Algodv2(token, server, port);
/** The functions in this section are left up to the resource server's implementation. */
function verifyChallengeSignature(originalChallengeToUint8Array, signedChallenge, originalAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!algosdk_1.default.verifyBytes(originalChallengeToUint8Array, signedChallenge, originalAddress)) {
            throw 'Invalid signature';
        }
    });
}
function getChallengeNonce() {
    return __awaiter(this, void 0, void 0, function* () {
        let status = yield client.status().do();
        // console.log(status);
        return Number(status['last-round']);
    });
}
function verifyChallengeNonce(nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        let blockData = yield client.block(nonce).do();
        let blockTimestamp = blockData.block.ts;
        var currentTimestamp = Math.round((new Date()).getTime() / 1000);
        return blockTimestamp > currentTimestamp - 600; //within last 10 minutes or 600 seconds
    });
}
/** Called after a user is fully verified. Handles permissions or performs actions based on the accepted asset IDs  */
function grantPermissions(assetIds) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const asset of assetIds) {
            console.log("User has been granted privileges of " + asset);
        }
    });
}
function verifyOwnershipOfAssets(address, assetIds) {
    return __awaiter(this, void 0, void 0, function* () {
        /**IMPORTANT: This is only for testing purposes.
         * It checks ownership of this random ASA at
         * https://goalseeker.purestake.io/algorand/testnet/asset/13365375.
         *
         * Once we add in our own ASAs, this should be removed */
        address = 'QPIUPDINBLYWPEZYYIOYJLXJSN75KGULUQARUN2SDRR7LSUS2BXCFLI6DY';
        let accountInfo = (yield client.accountInformation(address).do());
        for (const assetId of assetIds) {
            const requestedAsset = accountInfo.assets.find((elem) => elem['asset-id'].toString() === assetId);
            if (!requestedAsset) {
                throw `Address ${address} does not own requested asset : ${assetId}`;
            }
            else {
                console.log(`Success: Found asset in user's wallet: ${assetId}.`);
            }
        }
    });
}
/** The functions in this section are standard and should not be edited, except for possibly the function
 *  calls of the functions from above if edited. */
function validateChallenge(challenge) {
    try {
        if (!URI_REGEX.test(challenge.domain)) {
            throw `Inputted domain (${challenge.domain}) is not a valid URI`;
        }
        if (!algosdk_1.default.isValidAddress(challenge.address)) {
            throw `Inputted address (${challenge.address}) is not a valid Algorand address`;
        }
        if (!URI_REGEX.test(challenge.uri)) {
            throw `Inputted URI (${challenge.uri}) is not a valid URI`;
        }
        if (challenge.version !== "1") {
            throw `Invalid version. Must == 1`;
        }
        if (challenge.chainId !== "1") {
            throw `Invalid chainId. Must == 1`;
        }
        if (!verifyChallengeNonce(challenge.nonce)) {
            throw `Illegal nonce (${challenge.nonce}) specified`;
        }
        if (!ISO8601_DATE_REGEX.test(challenge.issuedAt)) {
            throw `Issued at date (${challenge.issuedAt}) is not in valid ISO 8601 format`;
        }
        if (challenge.expirationDate && !ISO8601_DATE_REGEX.test(challenge.expirationDate)) {
            throw `Inputted expiration date (${challenge.expirationDate}) is not in valid ISO 8601 format`;
        }
        if (challenge.notBefore && !ISO8601_DATE_REGEX.test(challenge.notBefore)) {
            throw `Inputted not before date (${challenge.notBefore}) is not in valid ISO 8601 format`;
        }
        if (challenge.resources) {
            for (const resource of challenge.resources) {
                if (!URI_REGEX.test(resource)) {
                    throw `Inputted resource in resources (${resource}) is not a valid URI`;
                }
            }
        }
    }
    catch (error) {
        return `Error: ${error}`;
    }
}
function constructMessageString(challenge) {
    let message = "";
    message += `${challenge.domain} wants you to sign in with your Algorand account:\n`;
    message += `${challenge.address}\n\n`;
    if (challenge.statement) {
        message += `${challenge.statement}\n`;
    }
    message += `\n`;
    message += `URI: ${challenge.uri}\n`;
    message += `Version: ${challenge.version}\n`;
    message += `Chain ID: ${challenge.chainId}\n`;
    message += `Nonce: ${challenge.nonce}\n`;
    message += `Issued At: ${challenge.issuedAt}`;
    if (challenge.expirationDate) {
        message += `\nExpiration Time: ${challenge.expirationDate}`;
    }
    if (challenge.notBefore) {
        message += `\nNot Before: ${challenge.notBefore}\n`;
    }
    if (challenge.resources) {
        message += `\nResources:`;
        for (const resource of challenge.resources) {
            message += `\n- ${resource}`;
        }
    }
    return message;
}
function createMessageFromString(challenge) {
    const messageArray = challenge.split("\n");
    const domain = messageArray[0].split(' ')[0];
    const address = messageArray[1];
    const statement = messageArray[3];
    const uri = messageArray[5].split(' ')[1];
    const version = messageArray[6].split(':')[1].trim();
    const chainId = messageArray[7].split(':')[1].trim();
    const nonce = Number(messageArray[8].split(':')[1].trim());
    const issuedAt = messageArray[9].split(':')[1].trim();
    let expirationDate;
    let notBefore;
    let resources = [];
    if (messageArray[10]) {
        if (messageArray[10].indexOf('Expiration Time:') != -1) {
            expirationDate = messageArray[10].split(':')[1].trim();
        }
        else if (messageArray[10].indexOf('Not Before:') != -1) {
            notBefore = messageArray[10].split(':')[1].trim();
        }
        else if (messageArray[10].indexOf('Resources:') != -1) {
            resources = [];
            for (let i = 11; i < messageArray.length; i++) {
                const resource = messageArray[i].split(' ')[1].trim();
                resources.push(resource);
            }
        }
    }
    if (messageArray[11]) {
        if (messageArray[11].indexOf('Not Before:') != -1) {
            notBefore = messageArray[11].split(':')[1].trim();
        }
        else if (messageArray[11].indexOf('Resources:') != -1) {
            resources = [];
            for (let i = 12; i < messageArray.length; i++) {
                const resource = messageArray[i].split(' ')[1].trim();
                resources.push(resource);
            }
        }
    }
    if (messageArray[12]) {
        if (messageArray[12].indexOf('Resources:') != -1) {
            resources = [];
            for (let i = 13; i < messageArray.length; i++) {
                const resource = messageArray[i].split(' ')[1].trim();
                resources.push(resource);
            }
        }
    }
    return { domain, address, statement, expirationDate, notBefore, resources, issuedAt, uri, version, chainId, nonce };
}
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4361.md
// This is EIP-4361 - Sign in With Ethereum
function createChallenge(domain, statement, address, uri, expirationDate, notBefore, resources) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const challenge = {
                domain,
                statement,
                address,
                uri,
                version: "1",
                chainId: "1",
                nonce: yield getChallengeNonce(),
                issuedAt: new Date().toISOString(),
                expirationDate,
                notBefore,
                resources
            };
            validateChallenge(challenge); // will throw error if invalid
            return constructMessageString(challenge);
        }
        catch (error) {
            return `Error: ${error}`;
        }
    });
}
exports.createChallenge = createChallenge;
function verifyChallenge(originalChallenge, signedChallenge) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const challenge = createMessageFromString(originalChallenge);
            validateChallenge(challenge);
            console.log("Success: Constructed challenge from string and verified it is well-formed.");
            const originalChallengeToUint8Array = new TextEncoder().encode(originalChallenge);
            const originalAddress = challenge.address;
            verifyChallengeSignature(originalChallengeToUint8Array, signedChallenge, originalAddress);
            console.log("Success: Signature matches address specified within the challenge.");
            if (challenge.resources) {
                yield verifyOwnershipOfAssets(challenge.address, challenge.resources);
                yield grantPermissions(challenge.resources);
            }
            return `Successfully granted access via Blockin`;
        }
        catch (error) {
            return `Error: ${error}`;
        }
    });
}
exports.verifyChallenge = verifyChallenge;

import nacl from "tweetnacl";
const URI_REGEX = /\w+:(\/?\/?)[^\s]+/;
const ISO8601_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
var chainDriver;
export function initializeVerify(driver) {
    chainDriver = driver;
}
export async function lookupTransactionById(txnID) {
    return await chainDriver.lookupTransactionById(txnID);
}
export async function getAssetDetails(txnId) {
    return await chainDriver.getAssetDetails(txnId);
}
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4361.md
// This is EIP-4361 - Sign in With Ethereum
/**
 * Creates a challenge to be signed by Wallet Provider to prove identity
 * @param domain
 * @param statement
 * @param address
 * @param uri
 * @param expirationDate
 * @param notBefore
 * @param resources
 * @returns
 */
export async function createChallenge(challengeParams) {
    const { domain, statement, address, uri, nonce, version = "1", chainId = "1", issuedAt = new Date().toISOString(), expirationDate = undefined, notBefore = undefined, resources = undefined } = challengeParams;
    try {
        const challenge = {
            domain,
            statement,
            address,
            uri,
            version,
            chainId,
            nonce,
            issuedAt,
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
}
/**
 * Verifies that the challenge was signed by the account belonging to the asset
 * @param originalChallenge
 * @param signedChallenge
 * @returns
 */
export async function verifyChallenge(originalChallenge, signedChallenge) {
    /*
        Make sure getChallengeString() is consistent with your implementation.

        If originalChallenge is a stringified JSON and you need to parse the challenge string out of it,
        this is where to implement it.

        If originalChallenge is already the challenge string, just return the inputted parameter.
    */
    const generatedEIP4361ChallengeStr = await getChallengeString(originalChallenge);
    const challenge = createMessageFromString(generatedEIP4361ChallengeStr);
    validateChallenge(challenge);
    console.log("Success: Constructed challenge from string and verified it is well-formed.");
    const currDate = new Date();
    if (challenge.expirationDate && currDate >= new Date(challenge.expirationDate)) {
        throw `Error: Challenge expired: ${challenge.expirationDate}`;
    }
    if (challenge.notBefore && currDate <= new Date(challenge.notBefore)) {
        throw `Error: Challenge invalid until: ${challenge.notBefore}`;
    }
    const originalAddress = challenge.address;
    await verifyChallengeSignature(originalChallenge, signedChallenge, originalAddress);
    console.log("Success: Signature matches address specified within the challenge.");
    if (challenge.resources) {
        await verifyOwnershipOfAssets(challenge.address, challenge.resources);
        grantPermissions(challenge.resources);
    }
    return `Successfully granted access via Blockin`;
}
// async function verifyChallengeNonce(nonce: number): Promise<boolean> {
//     let blockTimestamp = await chainDriver.getBlockTimestamp(nonce)
//     var currentTimestamp = Math.round((new Date()).getTime() / 1000);
//     return blockTimestamp > currentTimestamp - 60; //within last 1 minutes or 60 seconds
// }
/** Called after a user is fully verified. Handles permissions or performs actions based on the accepted asset IDs  */
async function grantPermissions(assetIds) {
    for (const assetIdStr of assetIds) {
        if (!assetIdStr.startsWith('Asset ID:')) {
            continue;
        }
        const assetId = assetIdStr.substring(10);
        console.log("User has been granted privileges of " + assetId);
    }
}
/** The functions in this section are standard and should not be edited, except for possibly the function
 *  calls of the functions from above if edited. */
function validateChallenge(challenge) {
    if (!URI_REGEX.test(challenge.domain)) {
        throw `Inputted domain (${challenge.domain}) is not a valid URI`;
    }
    if (!chainDriver.isValidAddress(challenge.address)) {
        throw `Inputted address (${challenge.address}) is not a valid Algorand address`;
    }
    if (!URI_REGEX.test(challenge.uri)) {
        throw `Inputted URI (${challenge.uri}) is not a valid URI`;
    }
    if (!challenge.nonce) {
        throw `No nonce (${challenge.nonce}) specified`;
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
            if (!resource.startsWith('Asset ID: ') && !URI_REGEX.test(resource)) {
                throw `Inputted resource in resources (${resource}) does not start with 'Asset ID: ' and is not a valid URI`;
            }
        }
    }
}
// async function getChallengeNonce(): Promise<number> {
//     let status = await chainDriver.getStatus()
//     return Number(status['last-round']);
// }
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
/**
 * This function usually is not needed. If it is not needed, just return the input as is.
 *
 * For Algorand and WalletConnect, you can't just explicitly call signBytes() so we had to include it as
 * a note within a txn object. This function extracts the challenge note from the txn object stringified JSON
 */
async function getChallengeString(txnBytes) {
    return chainDriver.getChallengeStringFromBytesToSign(txnBytes);
}
export function createMessageFromString(challenge) {
    const messageArray = challenge.split("\n");
    const domain = messageArray[0].split(' ')[0];
    const address = messageArray[1];
    const statement = messageArray[3];
    const uri = messageArray[5].split(' ')[1];
    const version = messageArray[6].split(':')[1].trim();
    const chainId = messageArray[7].split(':')[1].trim();
    const nonce = messageArray[8].split(':')[1].trim();
    const issuedAt = messageArray[9].split(':').slice(1).join(':').trim();
    let expirationDate;
    let notBefore;
    let resources = [];
    if (messageArray[10]) {
        if (messageArray[10].indexOf('Expiration Time:') != -1) {
            expirationDate = messageArray[10].split(':').slice(1).join(':').trim();
        }
        else if (messageArray[10].indexOf('Not Before:') != -1) {
            notBefore = messageArray[10].split(':').slice(1).join(':').trim();
        }
        else if (messageArray[10].indexOf('Resources:') != -1) {
            resources = [];
            for (let i = 11; i < messageArray.length; i++) {
                const resource = messageArray[i].split(' ').slice(1).join(' ').trim();
                resources.push(resource);
            }
        }
    }
    if (messageArray[11]) {
        if (messageArray[11].indexOf('Not Before:') != -1) {
            notBefore = messageArray[11].split(':').slice(1).join(':').trim();
        }
        else if (messageArray[11].indexOf('Resources:') != -1) {
            resources = [];
            for (let i = 12; i < messageArray.length; i++) {
                const resource = messageArray[i].split(' ').slice(1).join(' ').trim();
                resources.push(resource);
            }
        }
    }
    if (messageArray[12]) {
        if (messageArray[12].indexOf('Resources:') != -1) {
            resources = [];
            for (let i = 13; i < messageArray.length; i++) {
                const resource = messageArray[i].split(' ').slice(1).join(' ').trim();
                resources.push(resource);
            }
        }
    }
    return { domain, address, statement, expirationDate, notBefore, resources, issuedAt, uri, version, chainId, nonce };
}
/** The functions in this section are left up to the resource server's implementation. */
async function verifyChallengeSignature(originalChallengeToUint8Array, signedChallenge, originalAddress) {
    if (!nacl.sign.detached.verify(originalChallengeToUint8Array, signedChallenge, chainDriver.getPublicKey(originalAddress))) {
        throw 'Invalid signature';
    }
}
export async function getAllAssets(address) {
    return (await chainDriver.getAssets(address));
}
async function verifyOwnershipOfAssets(address, assetIds) {
    let assets = (await chainDriver.getAssets(address));
    for (const assetIdStr of assetIds) {
        if (!assetIdStr.startsWith('Asset ID:')) {
            continue;
        }
        const assetId = assetIdStr.substring(10);
        const requestedAsset = assets.find((elem) => elem['asset-id'].toString() === assetId);
        if (!requestedAsset) {
            throw `Address ${address} does not own requested asset : ${assetId}`;
        }
        else {
            console.log(`Success: Found asset in user's wallet: ${assetId}.`);
        }
    }
}

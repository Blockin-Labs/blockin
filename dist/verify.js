const URI_REGEX = /\w+:(\/?\/?)[^\s]+/;
const ISO8601_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
var chainDriver;
export function initializeVerify(driver) {
    chainDriver = driver;
}
/**
 * Looks up transaction data by ID using the specified chain driver
 * @param txnID - Transaction ID broadcasted to the network
 * @returns Metadata about the transaction
 */
export async function lookupTransactionById(txnID) {
    return await chainDriver.lookupTransactionById(txnID);
}
/**
 * Gets information about a specific asset using sepecified chain driver
 * @param assetId - Unique asset identifier
 * @returns Metadata about the asset
 */
export async function getAssetDetails(assetId) {
    return await chainDriver.getAssetDetails(assetId);
}
/**
 * Generates a nonce using the most recent block index. Can be called directly
 * or by specifiying the useBlockTimestampsForNonce flag in the createChallenge
 * options. verifyChallenge also offers two flags: (verifyNonceWithBlockTimestamps?: boolean;
 * and verificationTimeLimit?: number;) that ensure timestamp of the block was recent when
 * verifying.
 * @returns Last block index / timestamp / hash to be used as the nonce
 */
export async function generateNonceWithLastBlockTimestamp() {
    const nonce = await chainDriver.getLastBlockIndex();
    return nonce;
}
/**
 * Creates a challenge that is well-formed according to EIP-4361 - Sign in With Ethereum. Some
 * slight modifications to EIP-4361 for our library include 1) any blockchain's native address, signature,
 * and verification schemes are supported and 2) in resources, one may prefix an asset with 'Asset ID: '
 * to specify micro-authorizations or role-based access using an on-chain asset.
 * @param challengeParams - JSON object with the challenge details such as domain, uri, statement, address, etc.
 * @param options - JSON object speicfying any additional options when creating the challenge
 * @returns Well-formed challenge string to be signed by the user, if successsful. Error string is returned
 * upon failure.
 */
export async function createChallenge(challengeParams, options) {
    if (options === null || options === void 0 ? void 0 : options.useBlockTimestampsForNonce) {
        challengeParams.nonce = await generateNonceWithLastBlockTimestamp();
    }
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
        validateChallengeObjectIsWellFormed(challenge); // will throw error if invalid
        return constructChallengeStringFromChallengeObject(challenge);
    }
    catch (error) {
        return `Error: ${error}`;
    }
}
/**
 * verifyChallenge always checks three things: 1) originalChallenge was signed correctly by the user, 2) the
 * challenge is still well-formed and valid at the present time, and 3) the user owns all requested assets
 * in their wallet upon verification.
 * @param originalChallenge - The bytes (Uint8 Array) that were signed that represent the original challenge.
 * @param signedChallenge - The result of signing the bytes as a Uint8Array
 * @param options - Additional checks to perform when verifying the challenge.
 * @returns Returns { message: 'success' } object upon success. Throws an error if challenge is invalid.
 */
export async function verifyChallenge(originalChallenge, signedChallenge, options) {
    const verificationData = {};
    const generatedEIP4361ChallengeStr = await getChallengeStringFromBytes(originalChallenge);
    const challenge = constructChallengeObjectFromString(generatedEIP4361ChallengeStr);
    validateChallengeObjectIsWellFormed(challenge);
    console.log("Success: Constructed challenge from string and verified it is well-formed.");
    const currDate = new Date();
    verificationData.verificationTime = currDate;
    if (challenge.expirationDate && currDate >= new Date(challenge.expirationDate)) {
        throw `Error: Challenge expired: ${challenge.expirationDate}`;
    }
    if (challenge.notBefore && currDate <= new Date(challenge.notBefore)) {
        throw `Error: Challenge invalid until: ${challenge.notBefore}`;
    }
    const originalAddress = challenge.address;
    await verifyChallengeSignature(originalChallenge, signedChallenge, originalAddress);
    console.log("Success: Signature matches address specified within the challenge.");
    if (options === null || options === void 0 ? void 0 : options.verifyNonceWithBlockTimestamps) {
        let blockTimestamp = await chainDriver.getTimestampForBlock(challenge.nonce);
        verificationData.nonceTimestamp = blockTimestamp;
        const currentTimestamp = Math.round((new Date()).getTime() / 1000);
        const timeLimit = (options === null || options === void 0 ? void 0 : options.verificationTimeLimit) ? options === null || options === void 0 ? void 0 : options.verificationTimeLimit : 60;
        if (blockTimestamp <= currentTimestamp - timeLimit) {
            throw `Error: This challenge uses recent block timestamps for the nonce. The challenge must be verified within ${timeLimit} seconds of creating the challenge`;
        }
    }
    if ((options === null || options === void 0 ? void 0 : options.expectedDomain) && challenge.domain !== (options === null || options === void 0 ? void 0 : options.expectedDomain)) {
        throw `Error: Domain !== ${options === null || options === void 0 ? void 0 : options.expectedDomain}`;
    }
    if ((options === null || options === void 0 ? void 0 : options.expectedUri) && challenge.uri !== (options === null || options === void 0 ? void 0 : options.expectedUri)) {
        throw `Error: Uri !== ${options === null || options === void 0 ? void 0 : options.expectedUri}`;
    }
    if (challenge.resources) {
        const assetLookupData = await verifyOwnershipOfAssets(challenge.address, challenge.resources, options === null || options === void 0 ? void 0 : options.assetMinimumBalancesMap, options === null || options === void 0 ? void 0 : options.defaultMinimum);
        verificationData.assetLookupData = assetLookupData;
    }
    return {
        message: `Successfully granted access via Blockin`, success: true, verificationData
    };
}
/**
 * Validates the object is well-formed according to the EIP-4361 interface, plus our additional add-ons
 * to the interface for Blockin.
 * @param challenge - Valid JSON challenge object
 */
export function validateChallengeObjectIsWellFormed(challenge) {
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
/**
 * Parses a JSON object that specifies the challenge fields and returns a well-formatted EIP-4361 string.
 * Note that there is no validity checks on the inputs. It is a precondition that it is well-formed.
 * @param challenge - Well-formatted JSON object specifying the EIP-4361 fields.
 * @returns - Well-formatted EIP-4361 challenge string to be signed.
 */
export function constructChallengeStringFromChallengeObject(challenge) {
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
 * This function is called in order to parse the challenge string from the bytes that were signed.
 * It is specific to the specified chain driver. This function is needed because most signing
 * algorithms add a prefix to the string before signing, so this function attempts to undo that.
 * @param txnBytes - Original bytes that were signed as a Uint8Array
 * @returns Parses out and returns the challenge string that was signed
 */
export async function getChallengeStringFromBytes(txnBytes) {
    return chainDriver.getChallengeStringFromBytesToSign(txnBytes);
}
/**
 * Constructs a valid JSON challenge object from a valid well-formed EIP-4361 string. Note this
 * doesn't check for validity at all. See the EIP-4361 proposal for more details about exact formatting
 * requirements of the string.
 * @param challenge - Valid EIP-4361 challenge string
 * @returns JSON challenge object with all specified EIP-4361 fields
 */
export function constructChallengeObjectFromString(challenge) {
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
/**
 * Verifies a challenge is signed by the given addresses. Throws error if invalid. Specific to
 * specified chain driver.
 * @param originalChallengeToUint8Array - Uint8Array of the original bytes that were signed
 * @param signedChallenge - Uint8Array of the signature bytes
 * @param originalAddress - string that specifies the address who signed these bytes
 */
export async function verifyChallengeSignature(originalChallengeToUint8Array, signedChallenge, originalAddress) {
    await chainDriver.verifySignature(originalChallengeToUint8Array, signedChallenge, originalAddress);
}
/**
 * Gets all asset data for an address. Specific to specified chain driver. Be cautious when using this. It
 * may be more efficient to query address' balances for each asset.
 * @param address - address of user to lookup asset data for
 * @returns Metadata about all a user's owned assets
 */
export async function getAllAssetsForAddress(address) {
    return (await chainDriver.getAllAssetsForAddress(address));
}
/**
 * Verifies an address owns all specified resources. Ignores everything that doesn't start with 'Asset ID: '.
 * Defaults to succeeding if user has a balance of >= 1 for every asset.
 * @param address - Address to verify
 * @param resources - String array of URIs or Asset IDs. This function ignores every resource that doesn't start
 * with 'Asset ID: '
 * @param assetMinimumBalancesMap - Optional, but here, one can define a JSON object mapping of
 * 'assetIDs' => minimumBalances. If assetMinimumBalancesMap[assetId] exists, it will check that the user owns
 * more than the specified minimum balance. If not defined, will use the default.
 * @param defaultMinimum - Optional. Default is normally set to check if user owns >= 1. Here, you can specify a
 * new default minimum for all assets to fallback on if not defined in assetMinimumBalancesMap.
 * @returns If successful, verification was successful. Looked up asset data is also returned for convenience.
 * Throws error if invalid.
 */
export async function verifyOwnershipOfAssets(address, resources, assetMinimumBalancesMap, defaultMinimum) {
    let assetIds = [];
    if (resources) {
        const filteredAssetIds = resources.filter(elem => elem.startsWith('Asset ID: '));
        for (const assetStr of filteredAssetIds) {
            const assetId = assetStr.substring(10);
            assetIds.push(assetId);
        }
    }
    const assetLookupData = await chainDriver.verifyOwnershipOfAssets(address, assetIds, assetMinimumBalancesMap, defaultMinimum);
    return assetLookupData;
}

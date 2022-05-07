import { IChainDriver } from './@types/ChainDriver'
import { ChallengeParams, CreateChallengeOptions, EIP4361Challenge, VerifyChallengeOptions } from './@types/verify'

const URI_REGEX: RegExp = /\w+:(\/?\/?)[^\s]+/;
const ISO8601_DATE_REGEX: RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/

var chainDriver: IChainDriver

export function initializeVerify(driver: IChainDriver) {
    chainDriver = driver
}

export async function lookupTransactionById(txnID: string) {
    return await chainDriver.lookupTransactionById(txnID);
}

export async function getAssetDetails(assetId: string) {
    return await chainDriver.getAssetDetails(assetId)
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
export async function createChallenge(challengeParams: ChallengeParams, options?: CreateChallengeOptions) {
    const {
        domain,
        statement,
        address,
        uri,
        nonce,
        version = "1",
        chainId = "1",
        issuedAt = new Date().toISOString(),
        expirationDate = undefined,
        notBefore = undefined,
        resources = undefined
    } = challengeParams;

    if (options?.useBlockTimestampsForNonce) {
        challengeParams.nonce = await chainDriver.getLastBlockIndex()
    }

    try {
        const challenge: EIP4361Challenge = {
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
        }

        validateChallengeObjectIsWellFormed(challenge); // will throw error if invalid

        return constructChallengeStringFromChallengeObject(challenge);
    } catch (error: unknown) {
        return `Error: ${error}`;
    }
}

/**
 * Verifies that the challenge was signed by the account belonging to the asset
 * @param originalChallenge 
 * @param signedChallenge 
 * @returns 
 */
export async function verifyChallenge(originalChallenge: Uint8Array, signedChallenge: Uint8Array, options?: VerifyChallengeOptions) {
    /*
        Make sure getChallengeString() is consistent with your implementation.

        If originalChallenge is a stringified JSON and you need to parse the challenge string out of it,
        this is where to implement it.

        If originalChallenge is already the challenge string, just return the inputted parameter.
    */
    const generatedEIP4361ChallengeStr: string = await getChallengeStringFromBytes(originalChallenge);

    const challenge: EIP4361Challenge = constructChallengeObjectFromString(generatedEIP4361ChallengeStr);
    validateChallengeObjectIsWellFormed(challenge);
    console.log("Success: Constructed challenge from string and verified it is well-formed.");

    const currDate = new Date();
    if (challenge.expirationDate && currDate >= new Date(challenge.expirationDate)) {
        throw `Error: Challenge expired: ${challenge.expirationDate}`
    }

    if (challenge.notBefore && currDate <= new Date(challenge.notBefore)) {
        throw `Error: Challenge invalid until: ${challenge.notBefore}`
    }

    const originalAddress = challenge.address;
    await verifyChallengeSignature(originalChallenge, signedChallenge, originalAddress)
    console.log("Success: Signature matches address specified within the challenge.");

    if (options?.verifyNonceWithBlockTimestamps) {
        let blockTimestamp = await chainDriver.getTimestampForBlock(challenge.nonce);
        const currentTimestamp = Math.round((new Date()).getTime() / 1000);
        const timeLimit = options?.verificationTimeLimit ? options?.verificationTimeLimit : 60;

        if (blockTimestamp <= currentTimestamp - timeLimit) {
            throw `Error: This challenge uses recent block timestamps for the nonce. The challenge must be verified within ${timeLimit} seconds of creating the challenge`
        }
    }

    if (challenge.resources) {
        await verifyOwnershipOfAssets(challenge.address, challenge.resources, options?.assetMinimumBalancesMap, options?.defaultMinimum);
    }

    return `Successfully granted access via Blockin`;
}

/** The functions in this section are standard and should not be edited, except for possibly the function
 *  calls of the functions from above if edited. */
export function validateChallengeObjectIsWellFormed(challenge: EIP4361Challenge) {
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

export function constructChallengeStringFromChallengeObject(challenge: EIP4361Challenge): string {
    let message = "";
    message += `${challenge.domain} wants you to sign in with your Algorand account:\n`
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
            message += `\n- ${resource}`
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
export async function getChallengeStringFromBytes(txnBytes: Uint8Array): Promise<string> {
    return chainDriver.getChallengeStringFromBytesToSign(txnBytes);
}

export function constructChallengeObjectFromString(challenge: string): EIP4361Challenge {
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
        } else if (messageArray[10].indexOf('Not Before:') != -1) {
            notBefore = messageArray[10].split(':').slice(1).join(':').trim();
        } else if (messageArray[10].indexOf('Resources:') != -1) {
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
        } else if (messageArray[11].indexOf('Resources:') != -1) {
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
export async function verifyChallengeSignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string) {
    await chainDriver.verifySignature(originalChallengeToUint8Array, signedChallenge, originalAddress);
}

export async function getAllAssetsForAddress(address: string) {
    return (await chainDriver.getAllAssetsForAddress(address))
}

export async function verifyOwnershipOfAssets(address: string, resources: string[], assetMinimumBalancesMap?: any, defaultMinimum?: number) {
    let assetIds: string[] = [];
    if (resources) {
        const filteredAssetIds = resources.filter(elem => elem.startsWith('Asset ID: '));
        for (const assetStr of filteredAssetIds) {
            const assetId = assetStr.substring(10);
            assetIds.push(assetId);
        }
    }

    await chainDriver.verifyOwnershipOfAssets(address, assetIds, assetMinimumBalancesMap, defaultMinimum);
}

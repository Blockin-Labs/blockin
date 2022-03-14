import algoSdk from 'algosdk';

const URI_REGEX = /\w+:(\/?\/?)[^\s]+/;
const ISO8601_DATE_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/

interface EIP4361Challenge {
    domain: string;                 // Valid URI
    address: string;                // Valid Algo Adress
    statement?: string;             // Any string
    uri: string;                    // Valid URI
    version: string;                // Set at 1; Used for EIP-4361 version, but there is only one version
    chainId: string;                // Set to 1 since we will be using mainnet
    nonce: string;                  // Recent block hash
    issuedAt: string;               // ISO 8601 Date Specification (new Date().toISOString() in JavaScript)
    expirationDate?: string;        // Same as issuedAt
    notBefore?: string;             // Same as issuedAt
    // requestId?: string;          // Said it was optional and for simplicity, I am leaving out
    resources?: string[];           // Array of URIs
}

/** The functions in this section are left up to the resource server's implementation. */

//TODO: 

function getChallengeNonce(): string {
    return "0x123456789";
}

function verifyChallengeNonce(nonce: string): boolean {
    return true;
}

function grantPermissions() {
    // called after user is fully verified
    //grant permissions to user
    //could be a jwt, updating internal DB, or granting one time access to resource
}

/** The functions in this section are standard and should not be edited, except for possibly the function
 *  calls of the functions from above if edited. */

function validateChallenge(challenge: EIP4361Challenge) {
    try {
        if (!URI_REGEX.test(challenge.domain)) {
            throw `Inputted domain (${challenge.domain}) is not a valid URI`;
        }

        if (!algoSdk.isValidAddress(challenge.address)) {
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
    } catch (error: unknown) {
        return `Error: ${error}`;
    }
}

function constructMessageString(challenge: EIP4361Challenge): string {
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

function createMessageFromString(challenge: string): EIP4361Challenge {
    const messageArray = challenge.split("\n");
    const domain = messageArray[0].split(' ')[0];
    const address = messageArray[1];
    const statement = messageArray[3];
    const uri = messageArray[5].split(' ')[1];
    const version = messageArray[6].split(':')[1].trim();
    const chainId = messageArray[7].split(':')[1].trim();
    const nonce = messageArray[8].split(':')[1].trim();
    const issuedAt = messageArray[9].split(':')[1].trim();

    let expirationDate;
    let notBefore;
    let resources;
    if (messageArray[10].indexOf('Expiration Time:') != -1) {
        expirationDate = messageArray[10].split(':')[1].trim();
    } else if (messageArray[10].indexOf('Not Before:') != -1) {
        notBefore = messageArray[10].split(':')[1].trim();
    } else if (messageArray[10].indexOf('Resouces:') != -1) {
        resources = [];
        for (let i = 11; i < messageArray.length; i++) {
            const resource = messageArray[i].split(' ')[1].trim();
            resources.push(resource);
        }
    }

    if (messageArray[11].indexOf('Not Before:') != -1) {
        notBefore = messageArray[11].split(':')[1].trim();
    } else if (messageArray[11].indexOf('Resouces:') != -1) {
        resources = [];
        for (let i = 12; i < messageArray.length; i++) {
            const resource = messageArray[i].split(' ')[1].trim();
            resources.push(resource);
        }
    }

    if (messageArray[12].indexOf('Resouces:') != -1) {
        resources = [];
        for (let i = 13; i < messageArray.length; i++) {
            const resource = messageArray[i].split(' ')[1].trim();
            resources.push(resource);
        }
    }



    return { domain, address, statement, expirationDate, notBefore, resources, issuedAt, uri, version, chainId, nonce };
}

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4361.md
// This is EIP-4361 - Sign in With Ethereum
export function createChallenge(
    domain: string,
    statement: string,
    address: string,
    uri: string,
    expirationDate?: string,
    notBefore?: string,
    resources?: string[]
) {
    try {
        const challenge: EIP4361Challenge = {
            domain,
            statement,
            address,
            uri,
            version: "1",
            chainId: "1",
            nonce: getChallengeNonce(),
            issuedAt: new Date().toISOString(),
            expirationDate,
            notBefore,
            resources
        }

        validateChallenge(challenge); // will throw error if invalid

        return constructMessageString(challenge);
    } catch (error: unknown) {
        return `Error: ${error}`;
    }
}

export function signChallenge(challenge: string): Uint8Array | string {
    try {

        //const signedChallenge = await algo.sdk.signBytes(challenge);
        //or Wallet Connect sign $0 txn with challenge as the note


        // return "; //return signedChallenge or signed$0Txn as UInt8Array
        return ""
    } catch (error: unknown) {
        return `Error: ${error}`;
    }
}

export function verifyChallenge(originalChallenge: string, signedChallenge: Uint8Array) {
    try {
        const challenge: EIP4361Challenge = createMessageFromString(originalChallenge);
        validateChallenge(challenge);

        const originalChallengeToUint8Array = new TextEncoder().encode(originalChallenge);

        const originalAddress = challenge.address;
        if (!algoSdk.verifyBytes(originalChallengeToUint8Array, signedChallenge, originalAddress)) {
            throw 'Invalid signature';
        }

        //TODO: verify user has all requested ASAs using algosdk

        grantPermissions();

        return `Successfully granted access via Blockin`;
    } catch (error) {
        return `Error: ${error}`;
    }
}

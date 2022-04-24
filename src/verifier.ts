import nacl from "tweetnacl";
import { Blockin } from "./blockin";
import { EIP4361Challenge, IClient } from "./types";

export class Verifier extends Blockin {
    URI_REGEX: RegExp = /\w+:(\/?\/?)[^\s]+/;
    ISO8601_DATE_REGEX: RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/

    constructor(client: IClient, wallet: any) {
        super(client, wallet)
    }

    public async signChallenge(message: string) {
        const txn = await this.client.makePaymentTxn(this.wallet.account, this.wallet.account, 0, message)
        const unsighedTxnStr = this.client.getUnsignedTxnAsStr(txn)
        const result = await this.wallet.signTxn(unsighedTxnStr, message)
        return { txn, result }
    }

    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4361.md
    // This is EIP-4361 - Sign in With Ethereum
    public async createChallenge(
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
                nonce: await this.getChallengeNonce(),
                issuedAt: new Date().toISOString(),
                expirationDate,
                notBefore,
                resources
            }

            this.validateChallenge(challenge); // will throw error if invalid

            return this.constructMessageString(challenge);
        } catch (error: unknown) {
            return `Error: ${error}`;
        }
    }

    public async verifyChallenge(originalChallenge: Uint8Array, signedChallenge: Uint8Array) {
        try {
            /*
                Make sure getChallengeString() is consistent with your implementation.
    
                If originalChallenge is a stringified JSON and you need to parse the challenge string out of it,
                this is where to implement it.
    
                If originalChallenge is already the challenge string, just return the inputted parameter.
            */
            const generatedEIP4361ChallengeStr: string = await this.getChallengeString(originalChallenge);

            const challenge: EIP4361Challenge = this.createMessageFromString(generatedEIP4361ChallengeStr);
            this.validateChallenge(challenge);
            console.log("Success: Constructed challenge from string and verified it is well-formed.");

            // const originalChallengeToUint8Array = new TextEncoder().encode(originalChallenge);

            const originalAddress = challenge.address;
            await this.verifyChallengeSignature(originalChallenge, signedChallenge, originalAddress)
            console.log("Success: Signature matches address specified within the challenge.");

            if (challenge.resources) {
                await this.verifyOwnershipOfAssets(challenge.address, challenge.resources);
                this.grantPermissions(challenge.resources);
            }


            return `Successfully granted access via Blockin`;
        } catch (error) {
            return `Error: ${error}`;
        }
    }

    private async verifyChallengeNonce(nonce: number): Promise<boolean> {
        let blockData = await this.client.getBlock(nonce)
        let blockTimestamp = blockData.block.ts;
        var currentTimestamp = Math.round((new Date()).getTime() / 1000);

        return blockTimestamp > currentTimestamp - 60; //within last 1 minutes or 60 seconds
    }

    /** The functions in this section are standard and should not be edited, except for possibly the function
     *  calls of the functions from above if edited. */
    private validateChallenge(challenge: EIP4361Challenge) {
        try {
            if (!this.URI_REGEX.test(challenge.domain)) {
                throw `Inputted domain (${challenge.domain}) is not a valid URI`;
            }

            if (!this.client.isValidAddress(challenge.address)) {
                throw `Inputted address (${challenge.address}) is not a valid Algorand address`;
            }

            if (!this.URI_REGEX.test(challenge.uri)) {
                throw `Inputted URI (${challenge.uri}) is not a valid URI`;
            }

            if (challenge.version !== "1") {
                throw `Invalid version. Must == 1`;
            }

            if (challenge.chainId !== "1") {
                throw `Invalid chainId. Must == 1`;
            }

            if (!this.verifyChallengeNonce(challenge.nonce)) {
                throw `Illegal nonce (${challenge.nonce}) specified`;
            }

            if (!this.ISO8601_DATE_REGEX.test(challenge.issuedAt)) {
                throw `Issued at date (${challenge.issuedAt}) is not in valid ISO 8601 format`;
            }

            if (challenge.expirationDate && !this.ISO8601_DATE_REGEX.test(challenge.expirationDate)) {
                throw `Inputted expiration date (${challenge.expirationDate}) is not in valid ISO 8601 format`;
            }

            if (challenge.notBefore && !this.ISO8601_DATE_REGEX.test(challenge.notBefore)) {
                throw `Inputted not before date (${challenge.notBefore}) is not in valid ISO 8601 format`;
            }

            if (challenge.resources) {
                for (const resource of challenge.resources) {
                    if (!this.URI_REGEX.test(resource)) {
                        throw `Inputted resource in resources (${resource}) is not a valid URI`;
                    }
                }
            }
        } catch (error: unknown) {
            return `Error: ${error}`;
        }
    }

    private async getChallengeNonce(): Promise<number> {
        let status = await this.client.getStatus()
        // console.log(status);

        return Number(status['last-round']);
    }

    private constructMessageString(challenge: EIP4361Challenge): string {
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
    private async getChallengeString(txnBytes: Uint8Array): Promise<string> {
        const txnString = new TextDecoder().decode(txnBytes);

        const bytes = [];
        let idx = txnString.indexOf('note') + 7;
        while (txnBytes[idx] !== 163) {
            bytes.push(txnBytes[idx]);
            idx++;
        }

        const challengeString = new TextDecoder().decode(new Uint8Array(bytes));
        console.log(challengeString);

        return challengeString;
    }

    private createMessageFromString(challenge: string): EIP4361Challenge {
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
            } else if (messageArray[10].indexOf('Not Before:') != -1) {
                notBefore = messageArray[10].split(':')[1].trim();
            } else if (messageArray[10].indexOf('Resources:') != -1) {
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
            } else if (messageArray[11].indexOf('Resources:') != -1) {
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

    /** The functions in this section are left up to the resource server's implementation. */
    private async verifyChallengeSignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string) {
        if (!nacl.sign.detached.verify(originalChallengeToUint8Array, signedChallenge, this.client.decodeAddressGetPubKey(originalAddress))) {
            throw 'Invalid signature';
        }
    }

    private async verifyOwnershipOfAssets(address: string, assetIds: string[]) {
        const whitelistedAssets = ['99999991', '99999992', '99999993', '99999994', '99999995'];

        let accountInfo = (await this.client.getAccountInfo(address));
        for (const assetId of assetIds) {
            console.log(whitelistedAssets, assetId);
            if (whitelistedAssets.includes(assetId)) continue; //** THIS IS SPECIFIC TO OUR DEMO */

            const requestedAsset = accountInfo.assets.find((elem: any) => elem['asset-id'].toString() === assetId);

            if (!requestedAsset) {
                throw `Address ${address} does not own requested asset : ${assetId}`;
            } else {
                console.log(`Success: Found asset in user's wallet: ${assetId}.`);
            }
        }
    }

    /** Called after a user is fully verified. Handles permissions or performs actions based on the accepted asset IDs  */
    private grantPermissions(assetIds: string[]) {
        for (const asset of assetIds) {
            console.log("User has been granted privileges of " + asset);
        }
    }
}

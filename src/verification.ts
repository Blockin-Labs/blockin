// Used by resource server
export function createChallenge() {
    // This is EIP-4361 - Sign in With Ethereum
    // We could use this, generate a different scheme, or store nonces in the central server

    // ${domain} wants you to sign in with your Ethereum account:
    // ${address}

    // ${statement}

    // URI: ${uri}
    // Version: ${version}
    // Chain ID: ${chain-id}
    // Nonce: ${nonce}
    // Issued At: ${issued-at}
    // Expiration Time: ${expiration-time}
    // Not Before: ${not-before}
    // Request ID: ${request-id}
    // Resources:
    // - ${resources[0]}
    // - ${resources[1]}
    // ...
    // - ${resources[n]}
}

// Used by User
export function signChallenge(challenge: string) {
    //const signedChallenge = await algo.sdk.signBytes(challenge);
    //or Wallet Connect sign $0 txn with challenge as the note

    //return signedChallenge or signed$0Txn;
}

//Used by resource server
export function verifyChallenge(originalChallenge: string, signedChallenge: string) {
    //check signed challenge is a valid signature of orginal challenge
    //verify address in original challenge matches the address that signed it

    //TODO: think if we want to abstract the grant permissions functionality to a different function
    //verify user has all requested ASAs using algosdk

    //grant permissions to user
    //could be a jwt, updating internal DB, or granting one time access to resource

    //return to user a success message saying which permissions were granted
}

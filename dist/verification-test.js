async function testVerificationFunctions() {
    // // Generate a fake account for testing purposes
    // const newAccount = algosdk.generateAccount();
    // console.log("0) GENERATE FAKE ACCOUNT TO USE");
    // console.log("Generating a new Algorand public/private key pair...")
    // console.log("Address:", newAccount.addr);
    // console.log("Secret Key (bytes):", newAccount.sk.toLocaleString());
    // //generate the challenge
    // console.log("\n\n1) GENERATE CHALLENGE:");
    // const originalChallenge = await createChallenge(
    //     'https://vt.edu',
    //     'Blockin would like you to verify ownership of your ASAs.',
    //     newAccount.addr,
    //     '',
    //     undefined,
    //     undefined,
    //     ['13365375']
    // );
    // console.log("\"" + originalChallenge + "\"");
    // const originalChallengeToUint8Array = new TextEncoder().encode(originalChallenge);
    // const signedBytes = algosdk.signBytes(originalChallengeToUint8Array, newAccount.sk);
    // //sign the bytes and verify
    // console.log("\n\n2) SIGN BYTES USING SECRET KEY");
    // console.log("Signed Challenge (bytes):", signedBytes.toLocaleString());
    // const verified = await verifyChallenge(originalChallenge, signedBytes);
    // console.log("");
    // if (verified === `Successfully granted access via Blockin`) {
    //     console.log(verified);
    // } else {
    //     console.log('Error while granting access via Blockin');
    //     console.log(verified);
    // }
}
testVerificationFunctions();
export {};

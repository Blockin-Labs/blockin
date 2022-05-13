// Generated with util/create-component.js
import React, { useState } from "react";
import SignInWithBlockinButton from "./SignInWithBlockinButton";
import { SignInWithBlockinButtonProps, VerifyChallengeRequest } from "./SignInWithBlockinButton.types";

export default {
    title: "SignInWithBlockinButton"
};

const getVerifyChallengeSuccess = async () => {
    return { success: true, message: 'Successfully granted access via Blockin.' };
}

const getVerifyChallengeFailure = async () => {
    return { success: false, message: 'Error verifying challenge.' };
}

const handleSignChallengeFailure = async (challenge: string) => {
    return {
        message: 'Error: Problem signing challenge'
    }
}

const handleSignChallengeSuccess = async (challenge: string) => {
    return {
        originalBytes: new Uint8Array(23),
        signatureBytes: new Uint8Array(23),
        message: 'Success signing challenge'
    }
}

const props = {
    currentChain: 'Algorand Testnet',
    challengeParams: {
        domain: 'https://blockin.com',
        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
        address: '0x321426753456243856',
        uri: 'https://blockin.com/login',
        nonce: 'abs123xtz'
    },
    displayedAssets: [{
        name: 'Algorand Plan',
        assetId: '88007716',
        description: 'This asset represents a family plan membership. You must have a minimum balance of 1 of this asset in your wallet to receive family plan privileges.',
        frozen: false,
        defaultSelected: false,
    }, {
        name: 'Algostandard Plan',
        assetId: '87987698',
        description: 'This asset represents a standard plan membership. You must have a minimum balance of 1 of this asset in your wallet to receive standard plan privileges.',
        frozen: true,
        defaultSelected: true,
    }],
    displayedUris: [{
        name: 'Standard Access',
        uri: 'https://blockin.com',
        description: 'Anyone who verifies with a valid crypto address can be granted standard access.',
        frozen: false,
        defaultSelected: true,
    }],
    currentChainInfo: undefined,
    canAddCustomAssets: true,
    canAddCustomUris: true
}

export const SuccessfulSignAndVerify = () => {
    const [signedIn, setSignedIn] = useState(false);


    return <>
        Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
        <br />
        <br />
        <SignInWithBlockinButton
            {...props}
            signChallenge={async (challenge: string) => {
                const signChallengeResponse: VerifyChallengeRequest = await handleSignChallengeSuccess(challenge);
                return signChallengeResponse;
            }}
            verifyChallenge={async (signChallengeResponse: VerifyChallengeRequest) => {
                if (!signChallengeResponse.signatureBytes || !signChallengeResponse.originalBytes) {
                    return { success: false, message: `Error: Problem reading signature of challenge: ${signChallengeResponse.message}` }
                }

                const verificationResponse = await getVerifyChallengeSuccess();

                setSignedIn(true);
                return verificationResponse
            }}
        />
    </>
}

export const SignFailure = () => {
    const [signedIn, setSignedIn] = useState(false);


    return <>
        Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
        <br />
        <br />
        <SignInWithBlockinButton
            {...props}
            signChallenge={async (challenge: string) => {
                const signChallengeResponse: VerifyChallengeRequest = await handleSignChallengeFailure(challenge);
                return signChallengeResponse;
            }}
            verifyChallenge={async (signChallengeResponse: VerifyChallengeRequest) => {
                if (!signChallengeResponse.signatureBytes || !signChallengeResponse.originalBytes) {
                    return { success: false, message: `Error: Problem reading signature of challenge: ${signChallengeResponse.message}` }
                }

                const verificationResponse = await getVerifyChallengeSuccess();

                setSignedIn(true);
                return verificationResponse
            }}
        />
    </>
}


export const VerifyFailure = () => {
    const [signedIn, setSignedIn] = useState(false);


    return <>
        Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
        <br />
        <br />
        <SignInWithBlockinButton
            {...props}
            signChallenge={async (challenge: string) => {
                const signChallengeResponse: VerifyChallengeRequest = await handleSignChallengeSuccess(challenge);
                return signChallengeResponse;
            }}
            verifyChallenge={async (signChallengeResponse: VerifyChallengeRequest) => {
                if (!signChallengeResponse.signatureBytes || !signChallengeResponse.originalBytes) {
                    return { success: false, message: `Error: Problem reading signature of challenge: ${signChallengeResponse.message}` }
                }

                const verificationResponse = await getVerifyChallengeFailure();
                return verificationResponse
            }}
        />
    </>
}


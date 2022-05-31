// Generated with util/create-component.js
import React, { useState } from "react";
import { ChallengeParams } from "../../types/verify.types";
import SignInWithBlockinButton from "./SignInWithBlockinButton";
import { SignInWithBlockinButtonProps, SignChallengeResponse, SupportedChain } from "./SignInWithBlockinButton.types";

export default {
    title: "SignInWithBlockinButton"
};

const getVerifyChallengeSuccess = async () => {
    return { success: true, message: 'Successfully granted access via Blockin.' };
}

const getVerifyChallengeFailure = async () => {
    return { success: false, message: 'We encountered a problem verifying the challenge.' };
}

const handleSignChallengeFailure = async (challenge: string) => {
    return {
        message: 'We encountered a problem signing the challenge.'
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
    canAddCustomUris: true,
    customAddResourcesMessage: 'Example explanation message'
}

export const SuccessfulSignAndVerify = () => {
    const [signedIn, setSignedIn] = useState(false);
    const [connected, setConnected] = useState(false);
    const [chain, setChain] = useState('Ethereum');

    return <>
        Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
        <br />
        <br />
        <SignInWithBlockinButton
            {...props}
            currentChain={chain}
            onChainUpdate={async (chain: SupportedChain) => {
                setChain(chain.name);
            }}
            chainOptions={
                [
                    { name: 'Ethereum' },
                    { name: 'Algorand Testnet' },
                ]
            }
            loggedIn={signedIn}
            signChallenge={async (challenge: string) => {
                const signChallengeResponse: SignChallengeResponse = await handleSignChallengeSuccess(challenge);
                return signChallengeResponse;
            }}
            verifyChallengeOnBackend={async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObject: ChallengeParams) => {
                const verificationResponse = await getVerifyChallengeSuccess();

                setSignedIn(true);
                return verificationResponse;
            }}
            logout={async () => {
                setSignedIn(false);
            }}
            connected={connected}
            connect={async () => {
                setConnected(true);
            }}
            disconnect={async () => {
                setConnected(false);
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
                const signChallengeResponse: SignChallengeResponse = await handleSignChallengeFailure(challenge);
                return signChallengeResponse;
            }}
            verifyChallengeOnBackend={async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObject: ChallengeParams) => {
                const verificationResponse = await getVerifyChallengeSuccess();

                setSignedIn(true);
                return verificationResponse;
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
                const signChallengeResponse: SignChallengeResponse = await handleSignChallengeSuccess(challenge);
                return signChallengeResponse;
            }}
            verifyChallengeOnBackend={async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObject: ChallengeParams) => {
                const verificationResponse = await getVerifyChallengeFailure();
                return verificationResponse
            }}
        />
    </>
}


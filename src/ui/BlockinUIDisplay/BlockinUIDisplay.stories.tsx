// Generated with util/create-component.js
import React, { useState } from "react";
import { ChallengeParams } from "../../types/verify.types";
import { SignAndVerifyChallengeResponse, SupportedChainMetadata } from "./BlockinUIDisplay.types";
import BlockinUIDisplay from './BlockinUIDisplay';

export default {
    title: "BlockinUIDisplay"
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
        defaultSelected: false,
    }],
    // displayedUris: [{
    //     name: 'Standard Access',
    //     uri: 'https://blockin.com',
    //     description: 'Anyone who verifies with a valid crypto address can be granted standard access.',
    //     frozen: false,
    //     defaultSelected: true,
    // }],
    selectedChainInfo: {
        // getNameForAddress: async (address: string) => 'trevormil.eth'
    },
    // canAddCustomAssets: true,
    // canAddCustomUris: true,
    customAddHelpDisplay: 'Example explanation message'
}

export const SuccessfulSignAndVerify = () => {
    const [signedIn, setSignedIn] = useState('');
    const [connected, setConnected] = useState(false);
    const [chain, setChain] = useState('Algorand Testnet');

    return <>
        Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
        <br />
        <br />
        <BlockinUIDisplay
            {...props}
            selectedChainName={chain}
            onChainUpdate={async (chain: SupportedChainMetadata) => {
                setChain(chain.name);
            }}
            chainOptions={
                [
                    { name: 'Ethereum' },
                    { name: 'Algorand Testnet' },
                ]
            }
            loggedIn={!!signedIn}
            address={'0xe00dd9d317573f7b4868d8f2578c65544b153a27'}
            loggedInDetails={signedIn}
            signAndVerifyChallenge={async (challenge: string) => {
                const signChallengeResponse = await handleSignChallengeSuccess(challenge);

                const verificationResponse = await getVerifyChallengeSuccess();

                setSignedIn('Premium Plan');
                return verificationResponse;
            }}
            logout={async () => {
                setSignedIn('');
            }}
            connected={connected}
            connect={async () => {
                setConnected(true);
            }}
            disconnect={async () => {
                setConnected(false);
            }}
            modalStyle={{
                color: 'black'
            }}
        />
    </>
}

// export const SignFailure = () => {
//     const [signedIn, setSignedIn] = useState(false);

//     return <>
//         Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
//         <br />
//         <br />
//         <BlockinUIDisplay
//             {...props}
//             signChallenge={async (challenge: string) => {
//                 const signChallengeResponse: SignChallengeResponse = await handleSignChallengeFailure(challenge);
//                 return signChallengeResponse;
//             }}
//             verifyChallengeOnBackend={async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObject: ChallengeParams) => {
//                 const verificationResponse = await getVerifyChallengeSuccess();

//                 setSignedIn(true);
//                 return verificationResponse;
//             }}
//         />
//     </>
// }


// export const VerifyFailure = () => {
//     const [signedIn, setSignedIn] = useState(false);


//     return <>
//         Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
//         <br />
//         <br />
//         <BlockinUIDisplay
//             {...props}
//             signChallenge={async (challenge: string) => {
//                 const signChallengeResponse: SignChallengeResponse = await handleSignChallengeSuccess(challenge);
//                 return signChallengeResponse;
//             }}
//             verifyChallengeOnBackend={async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObject: ChallengeParams) => {
//                 const verificationResponse = await getVerifyChallengeFailure();
//                 return verificationResponse
//             }}
//         />
//     </>
// }


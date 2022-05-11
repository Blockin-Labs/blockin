// Generated with util/create-component.js
import React, { useState } from "react";
import { SignInWithBlockinButton } from "..";
import { ChainProps, VerifyChallengeRequest } from "../SignInWithBlockinButton/SignInWithBlockinButton.types";
import ChainSelect from "./ChainSelect";
import { ChainSelectProps } from "./ChainSelect.types";

export default {
    title: "ChainSelect"
};

const handleSignChallengeFailure = async (challenge: string) => {
    return {
        message: 'Error: Problem signing challenge'
    }
}

const getVerifyChallengeSuccess = async () => {
    return { success: true, message: 'Successfully granted access via Blockin.' };
}

const handleSignChallengeSuccess = async (challenge: string) => {

    return {
        originalBytes: new Uint8Array(23),
        signatureBytes: new Uint8Array(23),
        message: 'Success signing challenge'
    }
}

const chainOptions =
    [
        {
            name: 'Ethereum',
            displayedAssets: [{
                name: 'Family Plan',
                assetId: '88007716',
                description: 'This asset represents a family plan membership. You must have a minimum balance of 1 of this asset in your wallet to receive family plan privileges.',
                frozen: false,
                defaultSelected: false,
            }, {
                name: 'Standard Plan',
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
            signChallenge: async (challenge: string) => {
                const signChallengeResponse: VerifyChallengeRequest = await handleSignChallengeSuccess(challenge);
                return signChallengeResponse;
            }
        },
        {
            name: 'Algorand Mainnet',
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
            signChallenge: async (challenge: string) => {
                const signChallengeResponse: VerifyChallengeRequest = await handleSignChallengeSuccess(challenge);
                return signChallengeResponse;
            }
        },
        {
            name: 'Algorand Testnet',
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
            signChallenge: async (challenge: string) => {
                const signChallengeResponse: VerifyChallengeRequest = await handleSignChallengeSuccess(challenge);
                return signChallengeResponse;
            }
        }
    ]

export const ChainSelectByItself = () => <ChainSelect
    updateChain={(newChainProps: ChainProps) => { }}
    chains={chainOptions}
/>;


export const ChainSelectWithSignInButton = () => {
    const [chainProps, setChainProps] = useState<ChainProps>({
        name: 'Default',
        displayedAssets: [],
        displayedUris: [],
    });


    return <>
        <ChainSelect
            updateChain={(newChainProps: ChainProps) => { setChainProps(newChainProps) }}
            chains={chainOptions}
        />
        <SignInWithBlockinButton
            challengeParams={{
                domain: 'https://blockin.com',
                statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
                address: '0x321426753456243856',
                uri: 'https://blockin.com/login',
                nonce: 'abs123xtz'
            }}
            currentChain={chainProps.name}
            displayedAssets={chainProps.displayedAssets ? chainProps.displayedAssets : []}
            displayedUris={chainProps.displayedUris ? chainProps.displayedUris : []}
            signChallenge={async (challenge: string) => {
                const signChallengeResponse: VerifyChallengeRequest = await handleSignChallengeSuccess(challenge);
                return signChallengeResponse;
            }}
            verifyChallenge={async (signChallengeResponse: VerifyChallengeRequest) => {
                if (!signChallengeResponse.signatureBytes || !signChallengeResponse.originalBytes) {
                    return { success: false, message: `Error: Problem reading signature of challenge: ${signChallengeResponse.message}` }
                }

                const verificationResponse = await getVerifyChallengeSuccess();
                return verificationResponse
            }}
        />

    </>
};


// Generated with util/create-component.js
import React from "react";
import { ChainProps, VerifyChallengeRequest } from "../SignInWithBlockinButton/SignInWithBlockinButton.types";
import ChainSelect from "./ChainSelect";

export default {
    title: "ChainSelect"
};

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

export const WithBar = () => <ChainSelect
    updateChain={(newChainProps: ChainProps) => { }}
    chains={[
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
    ]}
/>;


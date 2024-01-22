// Generated with util/create-component.js
import React, { useState } from "react";
import { BlockinUIDisplay } from "..";
import { SignAndVerifyChallengeResponse, SupportedChainMetadata } from "../BlockinUIDisplay/BlockinUIDisplay.types";
import ChainSelect from "./ChainSelect";

export default {
  title: "ChainSelect"
};

const handleSignChallengeFailure = async (challenge: string) => {
  return {
    message: 'Problem signing challenge'
  }
}

const getVerifyChallengeSuccess = async () => {
  return { success: true, message: 'Successfully granted access via Blockin.' };
}

const handleSignChallengeSuccess = async (challenge: string) => {

  return {
    success: true,
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
      selectedChainInfo: undefined,
      signAndVerifyChallenge: async (challenge: string) => {
        const signChallengeResponse: SignAndVerifyChallengeResponse = await handleSignChallengeSuccess(challenge);
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
      selectedChainInfo: undefined,
      signAndVerifyChallenge: async (challenge: string) => {
        const signChallengeResponse: SignAndVerifyChallengeResponse = await handleSignChallengeSuccess(challenge);
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
      selectedChainInfo: undefined,
      signAndVerifyChallenge: async (challenge: string) => {
        const signChallengeResponse: SignAndVerifyChallengeResponse = await handleSignChallengeSuccess(challenge);
        return signChallengeResponse;
      }
    },
    {
      name: 'Simulated'
    }
  ]

export const ChainSelectByItself = () => <ChainSelect
  updateChain={(newChainProps: SupportedChainMetadata) => { }}
  chains={chainOptions}
/>;


export const ChainSelectWithSignInButton = () => {
  const [chainProps, setChainProps] = useState<SupportedChainMetadata>({
    name: 'Default',
  });


  return <div style={{ display: 'flex' }}>
    <ChainSelect
      updateChain={(newChainProps: SupportedChainMetadata) => { setChainProps(newChainProps) }}
      chains={chainOptions}
      selectedChain={chainProps}
    />
    <BlockinUIDisplay
      challengeParams={{
        domain: 'https://blockin.com',
        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
        address: '0x321426753456243856',
        uri: 'https://blockin.com/login',
        nonce: 'abs123xtz'
      }}
      selectedChainInfo={chainProps}
      selectedChainName="Ethereum"
      // displayedAssets={chainProps.displayedAssets ? chainProps.displayedAssets : []}
      // displayedUris={chainProps.displayedUris ? chainProps.displayedUris : []}
      signAndVerifyChallenge={async (challenge: string) => {
        const signChallengeResponse: SignAndVerifyChallengeResponse = await handleSignChallengeSuccess(challenge);
        const verificationResponse = await getVerifyChallengeSuccess();
        return verificationResponse
      }}
    />

  </div>
};


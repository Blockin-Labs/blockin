// Generated with util/create-component.js
import React, { useState } from "react";
import BlockinUIDisplay from './BlockinUIDisplay';
import { SupportedChainMetadata } from "./BlockinUIDisplay.types";

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
  displayedAssets:
    [
      //TODO: Add your own assets here. Note they can change dependent on the connected chain.
      {
        collectionId: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
        assetIds: ["15"],
        mustOwnAmounts: { start: 0, end: 0 },
        chain: 'Ethereum',
        name: "General Access",
        description: "Must not own any CryptoPunks NFTs to receive access to this site.",
        frozen: true,
        defaultSelected: true
      },
      {
        collectionId: 3,
        assetIds: [{ start: 1, end: 1 }],
        mustOwnAmounts: { start: 1, end: 1 },
        chain: 'BitBadges',
        name: "Administrative Privileges",
        description: "Must own the admin badge from BitBadges to receive administrative privileges on this site.",
        frozen: false,
        defaultSelected: false,
      }
      // {
      //   collectionId: 1,
      //   assetIds: [{ start: 1, end: 1 }],
      //   mustOwnAmounts: { start: 0, end: 0 },
      //   chain: 'BitBadges',
      //   name: "Premium Features",
      //   description: "Must own our premium features badge from BitBadges to receive premium features on this site.",
      //   frozen: false,
      //   defaultSelected: true,
      // },

    ],
  // displayedAssets: [{
  //   collectionId: 1,
  //   chain: 'BitBadges',
  //   assetIds: [{ start: 1, end: 10000 }],
  //   mustOwnAmounts: { start: 1, end: 1 },
  //   ownershipTimes: [{ start: 1, end: 10000 }],
  //   name: 'Algorand Plan',
  //   assetId: '88007716',
  //   description: 'This asset represents a family plan membership. You must have a minimum balance of 1 of this asset in your wallet to receive family plan privileges.',
  //   frozen: false,
  //   defaultSelected: false,
  //   additionalDisplay: <>dfjhsk</>
  // },
  // {
  // name: 'Algostandard Plan',
  // collectionId: 1,
  // chain: 'Ethereum',
  // mustOwnAmounts: [1],
  // assetIds: [1],
  // assetId: '87987698',
  // description: 'This asset represents a standard plan membership. You must have a minimum balance of 1 of this asset in your wallet to receive standard plan privileges.',
  // frozen: true,
  // defaultSelected: false,
  // }
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
}



export const SuccessfulSignAndVerify = () => {
  const [signedIn, setSignedIn] = useState('');
  const [connected, setConnected] = useState(false);
  const [chain, setChain] = useState('Ethereum');

  return <div
  // style={{ backgroundColor: 'black', color: 'white' }}
  >
    Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
    <br />
    <br />
    <BlockinUIDisplay
      {...props}
      selectedChainName={'Simulated'}
      onChainUpdate={async (chain: SupportedChainMetadata) => {
        if (chain?.name) setChain(chain.name);
      }}
      chainOptions={
        [
          { name: 'Ethereum Rinkeby' },
          // { name: 'Ethereum Localhost' },
          // { name: 'Ethereum Mainnet' },
          // { name: 'Algorand Testnet' },
          // { name: 'Algorand Testnet' },
          // { name: 'Algorand Testnet' },
          // { name: 'Algorand Testnet' },
          // { name: 'Algorand Testnet' },
          // { name: 'Algorand Testnet' },
          // { name: 'Algorand Testnet' },
          // { name: 'Algorand Testnet' },
          // { name: 'Algorand Testnet' },
        ]
      }

      // customDisplay={<p>fsjhasdkfhj</p>}
      hideChainSelect={true}
      loggedIn={!!signedIn}
      address={'0xe00dd9d317573f7b4868d8f2578c65544b153a27'}
      loggedInDetails={signedIn}
      customBeforeSigningWarning="This"
      signAndVerifyChallenge={async (challenge: string) => {
        // const signChallengeResponse = await handleSignChallengeSuccess(challenge);

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
      // displayedResources={[{
      //   uri: "X-ALGO-USDT",
      //   name: "USDT",
      //   description: "Tether USD on Algorand",
      //   // image?: string;
      //   frozen: true,
      //   defaultSelected: true,
      // }
      // ]}
      allowTimeSelect
      skipModalStep
    />
  </div>
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


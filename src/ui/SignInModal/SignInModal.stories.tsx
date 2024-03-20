// Generated with util/create-component.js
import React, { useState } from "react";
import SignInModal from './SignInModal';

export default {
  title: "SignInModal"
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
    uri: 'https://blockin.com',
    nonce: 'abs123xtz'
  },
  // displayedAssets: [],
  // // displayedUris: [{
  // //     name: 'Standard Access',
  // //     uri: 'https://blockin.com',
  // //     description: 'Anyone who verifies with a valid crypto address can be granted standard access.',
  // //     frozen: false,
  // //     defaultSelected: true,
  // // }],
  // selectedChainInfo: {
  //   // getNameForAddress: async (address: string) => 'trevormil.eth'
  // },
  // canAddCustomAssets: true,
  // canAddCustomUris: true,
}

export const SuccessfulSignAndVerify = () => {
  const [signedIn, setSignedIn] = useState('');
  const [connected, setConnected] = useState(false);
  const [chain, setChain] = useState('Ethereum');
  const [modalIsVisible, setModalIsVisible] = useState(false);

  return <>
    <button onClick={() => setModalIsVisible(!modalIsVisible)}>Toggle</button>
    <br />
    <br />
    <SignInModal
      {...props}
      modalIsVisible={modalIsVisible}
      setModalIsVisible={setModalIsVisible}
      selectedChainName={chain}
      address={'0xe00dd9d317573f7b4868d8f2578c65544b153a27'}
      nonWalletSignIn
      customBeforeSigningWarning="This sign-in will also be given to the parent window that sent you here."
      signAndVerifyChallenge={async (challenge: string) => {
        const signChallengeResponse = await handleSignChallengeSuccess(challenge);

        const verificationResponse = await getVerifyChallengeSuccess();

        setSignedIn('Premium Plan');
        return verificationResponse;
      }}
      displayedAssetGroups={[
        {
          name: 'Premium Plan',
          description: 'dsafdsf',
          image: '',
          frozen: false,
          defaultSelected: true,
          assetConditionGroup: {
            $and: [
              {
                assets: [{
                  chain: 'BitBadges',
                  collectionId: 1,
                  assetIds: [{ start: 9, end: 9 }],
                  mustOwnAmounts: { start: 0, end: 0 },
                  ownershipTimes: [],
                  // ownershipTimes: [{ start: 1, end: 1 }],
                }, {
                  chain: 'BitBadges',
                  collectionId: 1,
                  assetIds: [{ start: 9, end: 9 }],
                  mustOwnAmounts: { start: 0, end: 0 },
                  ownershipTimes: [],
                  // ownershipTimes: [{ start: 1, end: 1 }],
                }],
                options: {
                  numMatchesForVerification: 2,
                }
              },
              {
                assets: [{
                  chain: 'BitBadges',
                  collectionId: 1,
                  assetIds: [{ start: 9, end: 9 }],
                  mustOwnAmounts: { start: 0, end: 0 },
                  ownershipTimes: [{ start: 2, end: 2 }],
                }],
                options: {
                  numMatchesForVerification: 2,
                }
              },
            ]
          },
        },


        //   assetConditionGroup: {
        //     $and: [
        //       {
        //         $or: [
        //           {
        //             assets: [{
        //               chain: 'BitBadges',
        //               collectionId: 1,
        //               assetIds: [{ start: 9, end: 9 }],
        //               mustOwnAmounts: { start: 0, end: 0 },
        //               // ownershipTimes: [{ start: 1, end: 1 }],
        //             }, {
        //               chain: 'BitBadges',
        //               collectionId: 1,
        //               assetIds: [{ start: 9, end: 9 }],
        //               mustOwnAmounts: { start: 0, end: 0 },
        //               // ownershipTimes: [{ start: 1, end: 1 }],
        //             },
        //             {
        //               chain: 'BitBadges',
        //               collectionId: 1,
        //               assetIds: [{ start: 9, end: 9 }],
        //               mustOwnAmounts: { start: 0, end: 0 },
        //               // ownershipTimes: [{ start: 1, end: 1 }],
        //             }
        //             ],
        //             options: {
        //               numMatchesForVerification: 2,
        //             }
        //           },
        //           {
        //             assets: [{
        //               chain: 'BitBadges',
        //               collectionId: 1,
        //               assetIds: [{ start: 9, end: 9 }],
        //               mustOwnAmounts: { start: 0, end: 0 },
        //               ownershipTimes: [{ start: 2, end: 2 }],
        //             }],
        //             options: {
        //               numMatchesForVerification: 2,
        //             }
        //           },
        //           {
        //             assets: [{
        //               chain: 'BitBadges',
        //               collectionId: 1,
        //               assetIds: [{ start: 9, end: 9 }],
        //               mustOwnAmounts: { start: 0, end: 0 },
        //               ownershipTimes: [{ start: 2, end: 2 }],
        //             }],
        //             options: {
        //               numMatchesForVerification: 2,
        //             }
        //           }
        //         ]
        //       },
        //       {
        //         assets: [{
        //           chain: 'BitBadges',
        //           collectionId: 1,
        //           assetIds: [{ start: 9, end: 9 }],
        //           mustOwnAmounts: { start: 0, end: 0 },
        //           ownershipTimes: [{ start: 3, end: 3 }],
        //         }],
        //         options: {
        //           numMatchesForVerification: 2,
        //         }
        //       },
        //       {
        //         $or: [
        //           {
        //             assets: [{
        //               chain: 'BitBadges',
        //               collectionId: 1,
        //               assetIds: [{ start: 9, end: 9 }],
        //               mustOwnAmounts: { start: 0, end: 0 },
        //               ownershipTimes: [{ start: 1, end: 1 }],
        //             }],
        //             options: {
        //               numMatchesForVerification: 2,
        //             }
        //           },
        //           {
        //             assets: [{
        //               chain: 'BitBadges',
        //               collectionId: 1,
        //               assetIds: [{ start: 9, end: 9 }],
        //               mustOwnAmounts: { start: 0, end: 0 },
        //               ownershipTimes: [{ start: 2, end: 2 }],
        //             }],
        //             options: {
        //               numMatchesForVerification: 2,
        //             }
        //           },
        //           {
        //             assets: [{
        //               chain: 'BitBadges',
        //               collectionId: 1,
        //               assetIds: [{ start: 9, end: 9 }],
        //               mustOwnAmounts: { start: 0, end: 0 },
        //               ownershipTimes: [{ start: 2, end: 2 }],
        //             }],
        //             options: {
        //               numMatchesForVerification: 2,
        //             }
        //           }
        //         ]
        //       },
        //       {
        //         assets: [{
        //           chain: 'BitBadges',
        //           collectionId: 1,
        //           assetIds: [{ start: 9, end: 9 }],
        //           mustOwnAmounts: { start: 0, end: 0 },
        //           ownershipTimes: [{ start: 2, end: 2 }],
        //         }],
        //         options: {
        //           numMatchesForVerification: 2,
        //         }
        //       }

        //     ],
        //   }
        // }
      ]}
    />
  </>
}

// export const SignFailure = () => {
//     const [signedIn, setSignedIn] = useState(false);

//     return <>
//         Signed In: {signedIn ? 'Signed In' : 'Not Signed In'}
//         <br />
//         <br />
//         <SignInModal
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
//         <SignInModal
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


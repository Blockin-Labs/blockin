// Generated with util/create-component.js
import React, { useMemo, useState } from "react";
import SignInWithBitBadges from './SignInWithBitBadges';
import { ChallengeParams, NumberType } from "../../types/verify.types";
import { constructChallengeObjectFromString, createChallenge } from "../..";

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
  displayedAssets: [],
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

export const SignInWithBitBadgesButton = () => {
  const challengeParams: ChallengeParams<NumberType> = useMemo(() => ({
    domain: 'http://localhost:3000',
    statement: 'By signing in, you agree to our privacy policy and terms of service.',
    address: 'cosmos', //overriden by allowAddressSelect
    uri: 'http://localhost:3000',
    nonce: 'abc123',
    notBefore: undefined,
    issuedAt: new Date(Date.now()).toISOString(),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    resources: [],
    assetOwnershipRequirements: {
      $and: [
        {
          $or: [
            {
              assets: [{
                chain: 'BitBadges',
                collectionId: 1,
                assetIds: [{ start: 9, end: 9 }],
                mustSatisfyForAllAssets: true,
                mustOwnAmounts: { start: 0, end: 0 },
                ownershipTimes: [{ start: 1, end: 1 }],
              }, {
                chain: 'BitBadges',
                collectionId: 1,
                assetIds: [{ start: 9, end: 9 }],
                mustSatisfyForAllAssets: true,
                mustOwnAmounts: { start: 0, end: 0 },
                ownershipTimes: [{ start: 1, end: 1 }],
              },
              {
                chain: 'BitBadges',
                collectionId: 1,
                assetIds: [{ start: 9, end: 9 }],
                mustSatisfyForAllAssets: true,
                mustOwnAmounts: { start: 0, end: 0 },
                ownershipTimes: [{ start: 1, end: 1 }],
              }
              ],
              options: {
                numMatchesForVerification: 2,
              }
            },
            {
              assets: [{
                chain: 'BitBadges',
                collectionId: 1,
                assetIds: [{ start: 9, end: 9 }],
                mustSatisfyForAllAssets: true,
                mustOwnAmounts: { start: 0, end: 0 },
                ownershipTimes: [{ start: 2, end: 2 }],
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
                mustSatisfyForAllAssets: true,
                mustOwnAmounts: { start: 0, end: 0 },
                ownershipTimes: [{ start: 2, end: 2 }],
              }],
              options: {
                numMatchesForVerification: 2,
              }
            }
          ]
        },
        {
          assets: [{
            chain: 'BitBadges',
            collectionId: 1,
            assetIds: [{ start: 9, end: 9 }],
            mustSatisfyForAllAssets: true,
            mustOwnAmounts: { start: 0, end: 0 },
            ownershipTimes: [{ start: 3, end: 3 }],
          }],
          options: {
            numMatchesForVerification: 2,
          }
        },
        {
          $or: [
            {
              assets: [{
                chain: 'BitBadges',
                collectionId: 1,
                assetIds: [{ start: 9, end: 9 }],
                mustSatisfyForAllAssets: true,
                mustOwnAmounts: { start: 0, end: 0 },
                ownershipTimes: [{ start: 1, end: 1 }],
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
                mustSatisfyForAllAssets: true,
                mustOwnAmounts: { start: 0, end: 0 },
                ownershipTimes: [{ start: 2, end: 2 }],
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
                mustSatisfyForAllAssets: true,
                mustOwnAmounts: { start: 0, end: 0 },
                ownershipTimes: [{ start: 2, end: 2 }],
              }],
              options: {
                numMatchesForVerification: 2,
              }
            }
          ]
        },
        {
          assets: [{
            chain: 'BitBadges',
            collectionId: 1,
            assetIds: [{ start: 9, end: 9 }],
            mustSatisfyForAllAssets: true,
            mustOwnAmounts: { start: 0, end: 0 },
            ownershipTimes: [{ start: 2, end: 2 }],
          }],
          options: {
            numMatchesForVerification: 2,
          }
        }

      ],
    },
  }), []);

  console.log(createChallenge(challengeParams));
  console.log(constructChallengeObjectFromString(createChallenge(challengeParams), BigInt));

  return <>
    <SignInWithBitBadges
      //TODO: Customize your popup parameters here. See the documentation for more details.
      popupParams={{
        name: 'Event Verification',
        description: 'This will give you access to the requested event.',
        image: 'https://bitbadges-ipfs.infura-ipfs.io/ipfs/QmPfdaLWBUxH6ZrWmX1t7zf6zDiNdyZomafBqY5V5Lgwvj',
        challengeParams: challengeParams,
        allowAddressSelect: true,
      }}
      onSignAndBlockinVerify={async () => {

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


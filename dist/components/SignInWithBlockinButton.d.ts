/// <reference types="react" />
import { ChallengeParams } from '../@types/verify';
import { ChallengeResponse, PresetAsset, PresetUri, SupportedChain, VerifyChallengeRequest } from '../@types/SignInWithBlockinButton';
/**
 * challengeParams - EIP-4361 params that will make up the challenge. See ChallengeParams type.
 * displayedAssets - Assets to be displayed as resource options to sign-in with. See PresetAsset type.
 * displayedUris - Uris to be displayed as resource options to sign-inn with. See PresetUri type.
 * signChallenge - Blockin doesn't handle any signing functionality. When user clicks sign-in, it will call this
 * function which is passed in as a prop. Expects a return value that is consistent with the VerifyChallengeRequest
 * type.
 * verifyChallenge - This is where you perform the following: 1) call Blockin's verifyChallenge() within your backend,
 * 2) include any other additional verification checks about the challenge (like nonce verification if using a custom scheme
 * or assert anything else about the challenge details that should be expected ), 3) if verification passes, update whatever is
 * needed on frontend and backend to authenticate the user. Expects a response consistent with the ChallengeResponse type.
 * Note that we do this because for verification, you must have a valid API key and ChainDriver which is only accessible
 * via the authorizing resource's backend.
 * generateNonce - To generate a valid challenge, you must specify a nonce. This can either be done by specifying it in
 * challengeParams or via this function which returns a nonce string. This prop is optional, but if defined, we will
 * use this for the nonce and override challengeParams. You may choose to implement your own custom nonce scheme, or Blockin
 * natively suports using block timestamps for the nonces with the generateNonceWithLastBlockTimestamp() function (this must be
 * called from a backend with a ChainDriver set). Any scheme must be checked and verified in verifyChallenge() (see the
 * VerifyChallenge options for natively checking this if block timestamps are used). If you use your own custom nonce generation
 * scheme here, you will also have to use and implement your own nonce verification scheme in verifyChallenge().
 * currentChain - String name of current selected chain to use. There are a few chains that are preset as supported chains. If
 * currentChain does not match any of the supported chains, you must specify currentChainInfo to provide metadata about the chain.
 * currentChainInfo - This must be defined if currentChain is not in the preset supported chains. See the SupportedChain type.
 * canAddCustomAssets - Defaults to false. If set to true, user can add custom asset IDs to the challenge. Is useful if you grant
 * privileges based on metadata and not a specific asset ID, for example.
 * canAddCustomUris - Defaults to false. If set to true, user can add custom asset URIs to the challenge.
 * customAddResourcesMessage - This is for a helper message that is used if a user can add custom resources. This should explain
 * what assets or uris will be accepted, what permissions they will grant, etc. For example, here is where you may explain that
 * 'if asset with metadata hash === X is added, then privilege X will be granted'
 */
export declare const SignInWithBlockinButton: ({ challengeParams, displayedAssets, displayedUris, signChallenge, verifyChallenge, generateNonce, currentChain, currentChainInfo, canAddCustomAssets, canAddCustomUris, customAddResourcesMessage, }: {
    challengeParams: ChallengeParams;
    currentChain: string;
    displayedAssets: PresetAsset[];
    displayedUris: PresetUri[];
    signChallenge: (challenge: string) => Promise<VerifyChallengeRequest>;
    verifyChallenge: (verifyRequest: VerifyChallengeRequest) => Promise<ChallengeResponse>;
    generateNonce?: (() => Promise<string>) | undefined;
    currentChainInfo?: SupportedChain | undefined;
    canAddCustomAssets?: boolean | undefined;
    canAddCustomUris?: boolean | undefined;
    customAddResourcesMessage?: string | undefined;
}) => JSX.Element;

import { ChallengeParams } from "../../@types/verify";

/**
 * Used if needed to input different props for multiple chains using ChainSelect.
 */
export type ChainProps = {
    displayedAssets?: PresetAsset[];
    displayedUris?: PresetUri[];
    name: string;
    signChallenge?: (challenge: string) => Promise<VerifyChallengeOnBackendRequest>;
    currentChainInfo?: any | undefined;
}

/**
 * Specifies what should be returned from signChallenge.
 */
export type VerifyChallengeOnBackendRequest = {
    originalBytes?: Uint8Array;
    signatureBytes?: Uint8Array;
    message?: string;
}

/**
 * Specifies what should be returned from verifyChallenge.
 */
export type BlockinVerifyChallengeResponse = {
    success: boolean;
    message: string;
    challenge: ChallengeParams
}

/**
 * Defines schema for displaying an asset within pop-up window.
 */
export type PresetAsset = {
    assetId: string;
    name: string;
    description?: string;
    // image?: string;
    frozen: boolean;
    defaultSelected: boolean;
}

/**
 * Defines schema for displaying a uri within pop-up window.
 */
export type PresetUri = {
    uri: string;
    name: string;
    description?: string
    // image?: string;
    frozen: boolean;
    defaultSelected: boolean;
}

/**
 * Defines schema for displaying an asset within pop-up window.
 */
export type VerifyChallengeOnBackendResponse = {
    success: boolean,
    message: string
}

/**
 * Defines metadata about a supported chain within SignInWithBlockinButton. Used for UI purposes
 */
export type SupportedChain = {
    name: string;
    logo: string;
}

/**
 * Props to pass into the SignInWithBlockinButton component
 */
export type SignInWithBlockinButtonProps = {
    /**
     * EIP-4361 params that will make up the challenge. See ChallengeParams type.
     */
    challengeParams: ChallengeParams,
    /**
     * String name of current selected chain to use. There are a few chains that are preset as supported chains. If
     * currentChain does not match any of the supported chains, you must specify currentChainInfo to provide metadata about the chain.
     */
    currentChain: string,
    /**
     *  Assets to be displayed as resource options to sign-in with. See PresetAsset type.
     */
    displayedAssets: PresetAsset[],
    /**
     * Uris to be displayed as resource options to sign-in with. See PresetUri type.
     */
    displayedUris: PresetUri[],
    /**
     * Blockin doesn't handle any signing functionality. When user clicks sign-in, it will call this
     * function which is passed in as a prop. Expects a return value that is consistent with the VerifyChallengeOnBackendRequest 
     * type.
     */
    signChallenge: (challenge: string) => Promise<VerifyChallengeOnBackendRequest>,
    /**
     * This is where you perform the following: 1) call Blockin's verifyChallenge() within your backend,
     * 2) include any other additional verification checks about the challenge (like nonce verification if using a custom scheme 
     * or assert anything else about the challenge details that should be expected ), 3) if verification passes, update whatever is
     * needed on frontend and backend to authenticate the user. Expects a response consistent with the VerifyChallengeOnBackendResponse type. 
     * Note that we do this because for verification, you must have a valid API key and ChainDriver which is only accessible
     * via the authorizing resource's backend.
     */
    verifyChallengeOnBackend: (verifyRequest: VerifyChallengeOnBackendRequest) => Promise<VerifyChallengeOnBackendResponse>,
    /**
     * To generate a valid challenge, you must specify a nonce. This can either be done by specifying it in
     * challengeParams or via this function which returns a nonce string. This prop is optional, but if defined, we will 
     * use this for the nonce and override challengeParams. You may choose to implement your own custom nonce scheme, or Blockin
     * natively suports using block timestamps for the nonces with the generateNonceWithLastBlockTimestamp() function (this must be
     * called from a backend with a ChainDriver set). Any scheme must be checked and verified in verifyChallenge() (see the
     * VerifyChallenge options for natively checking this if block timestamps are used). If you use your own custom nonce generation
     * scheme here, you will also have to use and implement your own nonce verification scheme in verifyChallenge().
     */
    generateNonce?: () => Promise<string>,
    /**
     * This must be defined if currentChain is not in the preset supported chains. See the SupportedChain type.
     */
    currentChainInfo?: SupportedChain,
    /**
     * Defaults to false. If set to true, user can add custom asset IDs to the challenge. Is useful if you grant
     * privileges based on metadata and not a specific asset ID, for example.
     */
    canAddCustomAssets?: boolean,
    /**
     * Defaults to false. If set to true, user can add custom asset URIs to the challenge.
     */
    canAddCustomUris?: boolean,
    /**
     * This is for a helper message that is used if a user can add custom resources. This should explain
     * what assets or uris will be accepted, what permissions they will grant, etc. For example, here is where you may explain that 
     * 'if asset with metadata hash === X is added, then privilege X will be granted'
     */
    customAddResourcesMessage?: string
    // canSetExpirationDate: boolean,
    // canSetNotBeforeDate: boolean,
}
import { IChainDriver } from "./ChainDriver";

/**
 * Used if needed to input different props for multiple chains using ChainSelect.
 */
type ChainProps = {
    displayedAssets?: PresetAsset[];
    displayedUris?: PresetUri[];
    name: string;
    signChallenge?: (challenge: string) => Promise<VerifyChallengeRequest>;
    currentChainInfo?: any | undefined;
}

/**
 * Specifies what should be returned from signChallenge.
 */
type VerifyChallengeRequest = {
    originalBytes?: Uint8Array;
    signatureBytes?: Uint8Array;
    message?: string;
}

/**
 * Specifies what should be returned from verifyChallenge.
 */
type VerifyChallengeResponse = {
    success: boolean;
    message: string;
    challenge: ChallengeParams
}

/**
 * Defines schema for displaying an asset within pop-up window.
 */
type PresetAsset = {
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
type PresetUri = {
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
type ChallengeResponse = {
    success: boolean,
    message: string
}

/**
 * Defines schema for a supported chain within SignInWithBlockinButton
 */
type SupportedChain = {
    driver: IChainDriver;
    name: string;
    logo: string;
}
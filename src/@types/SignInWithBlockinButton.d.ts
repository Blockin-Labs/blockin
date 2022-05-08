import { IChainDriver } from "./ChainDriver";

type ChainProps = {
    displayedAssets?: PresetAsset[];
    displayedUris?: PresetUri[];
    name: string;
    signChallenge?: (challenge: string) => Promise<VerifyChallengeRequest>;
    currentChainInfo?: any | undefined;
}

type VerifyChallengeRequest = {
    originalBytes?: Uint8Array;
    signatureBytes?: Uint8Array;
    message?: string;
}

type VerifyChallengeResponse = {
    success: boolean;
    message: string;
    challenge: ChallengeParams
}

type PresetAsset = {
    assetId: string;
    name: string;
    description?: string;
    // image?: string;
    frozen: boolean;
    defaultSelected: boolean;
}

type PresetUri = {
    uri: string;
    name: string;
    description?: string
    // image?: string;
    frozen: boolean;
    defaultSelected: boolean;
}

type ChallengeResponse = {
    success: boolean,
    message: string
}

type SupportedChain = {
    driver: IChainDriver;
    name: string;
    logo: string;
}
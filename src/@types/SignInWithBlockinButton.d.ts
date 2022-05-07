import { IChainDriver } from "./ChainDriver";

type PresetAsset = {
    assetId: string;
    name: string;
    description?: string;
    // image?: string;
}

type PresetUri = {
    uri: string;
    name: string;
    description?: string
    // image?: string;
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
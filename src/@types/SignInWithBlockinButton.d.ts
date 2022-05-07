import { IChainDriver } from "./ChainDriver";

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
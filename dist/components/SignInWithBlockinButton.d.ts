/// <reference types="react" />
import { ChallengeParams } from '../@types/verify';
import { ChallengeResponse, PresetAsset, PresetUri, SupportedChain } from '../@types/SignInWithBlockinButton';
export declare const SignInWithBlockinButton: ({ challengeParams, displayedAssets, displayedUris, signAndVerifyChallenge, generateNonce, currentChain, currentChainInfo, useBlockTimestampsForNonce, canAddCustomAssets, canAddCustomUris, customAddResourcesMessage, }: {
    challengeParams: ChallengeParams;
    currentChain: string;
    displayedAssets: PresetAsset[];
    displayedUris: PresetUri[];
    signAndVerifyChallenge: (challenge: string) => Promise<ChallengeResponse>;
    generateNonce?: (() => Promise<string>) | undefined;
    useBlockTimestampsForNonce?: boolean | undefined;
    currentChainInfo?: SupportedChain | undefined;
    canAddCustomAssets?: boolean | undefined;
    canAddCustomUris?: boolean | undefined;
    customAddResourcesMessage?: string | undefined;
}) => JSX.Element;

/// <reference types="react" />
import { ChallengeParams } from '../@types/verify';
import { ChallengeResponse, PresetAsset, PresetUri, SupportedChain, VerifyChallengeRequest } from '../@types/SignInWithBlockinButton';
export declare const SignInWithBlockinButton: ({ challengeParams, displayedAssets, displayedUris, signChallenge, verifyChallenge, generateNonce, currentChain, currentChainInfo, useBlockTimestampsForNonce, canAddCustomAssets, canAddCustomUris, customAddResourcesMessage, }: {
    challengeParams: ChallengeParams;
    currentChain: string;
    displayedAssets: PresetAsset[];
    displayedUris: PresetUri[];
    signChallenge: (challenge: string) => Promise<VerifyChallengeRequest>;
    verifyChallenge: (verifyRequest: VerifyChallengeRequest) => Promise<ChallengeResponse>;
    generateNonce?: (() => Promise<string>) | undefined;
    useBlockTimestampsForNonce?: boolean | undefined;
    currentChainInfo?: SupportedChain | undefined;
    canAddCustomAssets?: boolean | undefined;
    canAddCustomUris?: boolean | undefined;
    customAddResourcesMessage?: string | undefined;
}) => JSX.Element;

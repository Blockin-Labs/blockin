/// <reference types="react" />
import { ChallengeParams } from '../@types/verify';
import { ChallengeResponse, PresetAsset, PresetUri, SupportedChain } from '../@types/SignInWithBlockinButton';
export declare const SignInWithBlockinButton: ({ challengeParams, hideResources, displayedAssets, displayedUris, signAndVerifyChallenge, generateNonce, currentChain, currentChainInfo, useBlockTimestampsForNonce, }: {
    challengeParams: ChallengeParams;
    hideResources?: boolean | undefined;
    currentChain: string;
    displayedAssets: PresetAsset[];
    displayedUris: PresetUri[];
    signAndVerifyChallenge: (challenge: string) => Promise<ChallengeResponse>;
    generateNonce?: (() => Promise<string>) | undefined;
    useBlockTimestampsForNonce?: boolean | undefined;
    currentChainInfo?: SupportedChain | undefined;
}) => JSX.Element;

/// <reference types="react" />
import './styles.css';
declare type PresetAsset = {
    assetId: string;
    name: string;
    description?: string;
};
declare type PresetUri = {
    uri: string;
    name: string;
    description?: string;
};
declare type ButtonChallengeParams = {
    domain: string;
    statement: string;
    address: string;
    uri: string;
    version?: string;
    chainId?: string;
    issuedAt?: string;
    expirationDate?: string;
    notBefore?: string;
};
declare type ChallengeResponse = {
    success: boolean;
    message: string;
};
export declare const SignInWithBlockinButton: ({ challengeParams, chain, displayedAssets, displayedUris, signAndVerifyChallenge, generateNonce, hideResources, }: {
    challengeParams: ButtonChallengeParams;
    chain: string;
    displayedAssets: PresetAsset[];
    displayedUris: PresetUri[];
    signAndVerifyChallenge: (challenge: string) => Promise<ChallengeResponse>;
    generateNonce: () => Promise<string>;
    hideResources?: boolean | undefined;
}) => JSX.Element;
export {};

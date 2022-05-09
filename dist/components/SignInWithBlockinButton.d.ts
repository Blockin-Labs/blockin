/// <reference types="react" />
import { SignInWithBlockinButtonProps } from '../@types/SignInWithBlockinButton';
/**
 * SignInWithBlockinButton - React Button that handles functionality of creating a Blockin challenge for a user.
 * As props, you can pass in everything needed to generate, sign, and verify the challenge. See the documentation
 * for each prop for more information.
 */
export declare const SignInWithBlockinButton: ({ challengeParams, displayedAssets, displayedUris, signChallenge, verifyChallenge, generateNonce, currentChain, currentChainInfo, canAddCustomAssets, canAddCustomUris, customAddResourcesMessage, }: SignInWithBlockinButtonProps) => JSX.Element;

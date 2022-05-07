import { IChainDriver } from './@types/ChainDriver';
import { ChallengeParams, CreateChallengeOptions, EIP4361Challenge, VerifyChallengeOptions } from './@types/verify';
export declare function initializeVerify(driver: IChainDriver): void;
export declare function lookupTransactionById(txnID: string): Promise<any>;
export declare function getAssetDetails(assetId: string): Promise<any>;
/**
 * Creates a challenge to be signed by Wallet Provider to prove identity
 * @param domain
 * @param statement
 * @param address
 * @param uri
 * @param expirationDate
 * @param notBefore
 * @param resources
 * @returns
 */
export declare function createChallenge(challengeParams: ChallengeParams, options?: CreateChallengeOptions): Promise<string>;
/**
 * Verifies that the challenge was signed by the account belonging to the asset
 * @param originalChallenge
 * @param signedChallenge
 * @returns
 */
export declare function verifyChallenge(originalChallenge: Uint8Array, signedChallenge: Uint8Array, options?: VerifyChallengeOptions): Promise<string>;
/** The functions in this section are standard and should not be edited, except for possibly the function
 *  calls of the functions from above if edited. */
export declare function validateChallengeObjectIsWellFormed(challenge: EIP4361Challenge): void;
export declare function constructChallengeStringFromChallengeObject(challenge: EIP4361Challenge): string;
/**
 * This function usually is not needed. If it is not needed, just return the input as is.
 *
 * For Algorand and WalletConnect, you can't just explicitly call signBytes() so we had to include it as
 * a note within a txn object. This function extracts the challenge note from the txn object stringified JSON
 */
export declare function getChallengeStringFromBytes(txnBytes: Uint8Array): Promise<string>;
export declare function constructChallengeObjectFromString(challenge: string): EIP4361Challenge;
/** The functions in this section are left up to the resource server's implementation. */
export declare function verifyChallengeSignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string): Promise<void>;
export declare function getAllAssetsForAddress(address: string): Promise<any>;
export declare function verifyOwnershipOfAssets(address: string, resources: string[], assetMinimumBalancesMap?: any, defaultMinimum?: number): Promise<void>;

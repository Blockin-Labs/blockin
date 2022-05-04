import { IChainDriver, UniversalTxn } from './@types/ChainDriver';
import { CreatePaymentParams } from "./@types/auth";
import { ChallengeParams } from './@types/verify';
export declare function initializeVerify(driver: IChainDriver): void;
export declare function getAssetDetails(txnId: string): Promise<any>;
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
export declare function createChallenge(challengeParams: ChallengeParams): Promise<string>;
/**
 * Creates a dummy unsiged payment txn sending 0 from wallet to wallet
 * Wallet Provider can then sign this dummy txn to prove their identity
 * @param account
 * @param message
 * @returns
 */
export declare function createPaymentTxn(createPaymentParams: CreatePaymentParams): Promise<UniversalTxn>;
/**
 * Verifies that the challenge was signed by the account belonging to the asset
 * @param originalChallenge
 * @param signedChallenge
 * @returns
 */
export declare function verifyChallenge(originalChallenge: Uint8Array, signedChallenge: Uint8Array): Promise<string>;
export declare function getAssets(address: string): Promise<any>;

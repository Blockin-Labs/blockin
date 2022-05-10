import { IChainDriver } from './@types/ChainDriver';
import { ChallengeParams, CreateChallengeOptions, EIP4361Challenge, VerifyChallengeOptions } from './@types/verify';
export declare function initializeVerify(driver: IChainDriver): void;
/**
 * Creates a challenge that is well-formed according to EIP-4361 - Sign in With Ethereum. Some
 * slight modifications to EIP-4361 for our library include 1) any blockchain's native address, signature,
 * and verification schemes are supported and 2) in resources, one may prefix an asset with 'Asset ID: '
 * to specify micro-authorizations or role-based access using an on-chain asset.
 *
 *
 * @param challengeParams - JSON object with the challenge details such as domain, uri, statement, address, etc.
 * @param options - JSON object speicfying any additional options when creating the challenge
 * @returns Well-formed challenge string to be signed by the user, if successsful. Error string is returned
 * upon failure.
 */
export declare function createChallenge(challengeParams: ChallengeParams, options?: CreateChallengeOptions): Promise<string>;
/**
 * verifyChallenge always checks three things: 1) originalChallenge was signed correctly by the user, 2) the
 * challenge is still well-formed and valid at the present time, and 3) the user owns all requested assets
 * in their wallet upon verification.
 * @param originalChallenge - The bytes (Uint8 Array) that were signed that represent the original challenge.
 * @param signedChallenge - The result of signing the bytes as a Uint8Array
 * @param options - Additional checks to perform when verifying the challenge.
 * @returns Returns { message: 'success' } object upon success. Throws an error if challenge is invalid.
 */
export declare function verifyChallenge(originalChallenge: Uint8Array, signedChallenge: Uint8Array, options?: VerifyChallengeOptions): Promise<{
    message: string;
    success: boolean;
    verificationData: any;
}>;
/**
 * Looks up transaction data by ID using the specified chain driver
 * @param txnID - Transaction ID broadcasted to the network
 * @returns Metadata about the transaction
 */
export declare function lookupTransactionById(txnID: string): Promise<any>;
/**
 * Gets information about a specific asset using sepecified chain driver
 * @param assetId - Unique asset identifier
 * @returns Metadata about the asset
 */
export declare function getAssetDetails(assetId: string): Promise<any>;
/**
 * Generates a nonce using the most recent block index. Can be called directly
 * or by specifiying the useBlockTimestampsForNonce flag in the createChallenge
 * options. verifyChallenge also offers two flags: (verifyNonceWithBlockTimestamps?: boolean;
 * and verificationTimeLimit?: number;) that ensure timestamp of the block was recent when
 * verifying.
 * @returns Last block index / timestamp / hash to be used as the nonce
 */
export declare function generateNonceWithLastBlockTimestamp(): Promise<any>;
/**
 * Validates the object is well-formed according to the EIP-4361 interface, plus our additional add-ons
 * to the interface for Blockin.
 * @param challenge - Valid JSON challenge object
 */
export declare function validateChallengeObjectIsWellFormed(challenge: EIP4361Challenge): void;
/**
 * Parses a JSON object that specifies the challenge fields and returns a well-formatted EIP-4361 string.
 * Note that there is no validity checks on the inputs. It is a precondition that it is well-formed.
 * @param challenge - Well-formatted JSON object specifying the EIP-4361 fields.
 * @returns - Well-formatted EIP-4361 challenge string to be signed.
 */
export declare function constructChallengeStringFromChallengeObject(challenge: EIP4361Challenge): string;
/**
 * This function is called in order to parse the challenge string from the bytes that were signed.
 * It is specific to the specified chain driver. This function is needed because most signing
 * algorithms add a prefix to the string before signing, so this function attempts to undo that.
 * @param txnBytes - Original bytes that were signed as a Uint8Array
 * @returns Parses out and returns the challenge string that was signed
 */
export declare function getChallengeStringFromBytes(txnBytes: Uint8Array): Promise<string>;
/**
 * Constructs a valid JSON challenge object from a valid well-formed EIP-4361 string. Note this
 * doesn't check for validity at all. See the EIP-4361 proposal for more details about exact formatting
 * requirements of the string.
 * @param challenge - Valid EIP-4361 challenge string
 * @returns JSON challenge object with all specified EIP-4361 fields
 */
export declare function constructChallengeObjectFromString(challenge: string): EIP4361Challenge;
/**
 * Verifies a challenge is signed by the given addresses. Throws error if invalid. Specific to
 * specified chain driver.
 * @param originalChallengeToUint8Array - Uint8Array of the original bytes that were signed
 * @param signedChallenge - Uint8Array of the signature bytes
 * @param originalAddress - string that specifies the address who signed these bytes
 */
export declare function verifyChallengeSignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string): Promise<void>;
/**
 * Gets all asset data for an address. Specific to specified chain driver. Be cautious when using this. It
 * may be more efficient to query address' balances for each asset.
 * @param address - address of user to lookup asset data for
 * @returns Metadata about all a user's owned assets
 */
export declare function getAllAssetsForAddress(address: string): Promise<any>;
/**
 * Verifies an address owns all specified resources. Ignores everything that doesn't start with 'Asset ID: '.
 * Defaults to succeeding if user has a balance of >= 1 for every asset.
 * @param address - Address to verify
 * @param resources - String array of URIs or Asset IDs. This function ignores every resource that doesn't start
 * with 'Asset ID: '
 * @param assetMinimumBalancesMap - Optional, but here, one can define a JSON object mapping of
 * 'assetIDs' => minimumBalances. If assetMinimumBalancesMap[assetId] exists, it will check that the user owns
 * more than the specified minimum balance. If not defined, will use the default.
 * @param defaultMinimum - Optional. Default is normally set to check if user owns >= 1. Here, you can specify a
 * new default minimum for all assets to fallback on if not defined in assetMinimumBalancesMap.
 * @returns If successful, verification was successful. Looked up asset data is also returned for convenience.
 * Throws error if invalid.
 */
export declare function verifyOwnershipOfAssets(address: string, resources: string[], assetMinimumBalancesMap?: any, defaultMinimum?: number): Promise<any>;

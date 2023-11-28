import { NumberType } from "bitbadgesjs-utils";
import { UintRange } from "bitbadgesjs-proto";

export interface StringRange {
  start: string,
  end: string,
}
export interface Asset<T extends NumberType> {
  chain: string,
  collectionId: string | NumberType,
  assetIds: (string | UintRange<T>)[],
  ownershipTimes?: UintRange<T>[],
  mustOwnAmounts: UintRange<T>,
  additionalCriteria?: string,
}

/**
 * Interface for EIP-4361 Challenge - Sign in With Ethereum
 * 
 * For more information and documentation, view the EIP proposal.
 * 
 * We extend it to support assets.
 */
export interface ChallengeParams<T extends NumberType> {
  domain: string,
  statement: string,
  address: string,
  uri: string,
  nonce: string,
  version?: string,
  chainId?: string,
  issuedAt?: string,
  expirationDate?: string,
  notBefore?: string,
  resources?: string[],
  assets?: Asset<T>[],
}

/**
 * Options that can be specified when calling createChallenge()
 */
export type CreateChallengeOptions = {
  // /**
  //  * Gets the latest block timestamp and overrides the inputted nonce, if there is one.
  //  * 
  //  * Note that if you specify this, you can also verify the recency of the challenge using
  //  * the verifyNonceUsingBlockTimestamps and verificationTimeLimit in the verifyChallenge()
  //  * options.
  //  */
  // useBlockTimestampsForNonce?: boolean;
}

export type VerifyChallengeOptions = {
  /**
   * Optionally define the expected details to check. If the challenge was edited and the details
   * do not match, the challenge will fail verification.
   */
  expectedChallengeParams?: Partial<ChallengeParams<NumberType>>;

  /**
   * Optional function to call before verification. This is useful to verify the challenge is
   * valid before proceeding with verification.
   * 
   * Note you can use expectedChallengeParams to verify values equal as expected. 
   * 
   * This function is useful if you need to implement custom logic other than strict equality).
   * For example, assert that only one of assets A, B, or C are defined and not all three.
   */
  beforeVerification?: (params: ChallengeParams<NumberType>) => Promise<void>;

  /**
   * For verification of assets, instead of dynamically fetching the assets, you can specify a snapshot of the assets.
   * 
   * This is useful if you have a snapshot, balances will not change, or you are verifying in an offline manner.
   */
  balancesSnapshot?: object

  /**
   * If true, we will return the .qrCodeText property in the response. This is the text to be used to generate a QR code for verification.
   */
  qrCode?: boolean,

  /**
   * If true, we do not check timestamps (expirationDate / notBefore). This is useful if you are verifying a challenge that is expected to be verified at a future time.
   */
  skipTimestampVerification?: boolean,

  /**
   * If true, we do not check asset ownership. This is useful if you are verifying a challenge that is expected to be verified at a future time.
   */
  skipAssetVerification?: boolean,
}
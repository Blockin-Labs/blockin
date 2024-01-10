export type NumberType = string | bigint | number | boolean;
export interface UintRange<T extends NumberType> {
  start: T,
  end: T,
}

export interface StringRange {
  start: string,
  end: string,
}
export interface Asset<T extends NumberType> {
  chain: string,
  collectionId: T | string,
  assetIds: (string | UintRange<T>)[],
  ownershipTimes?: UintRange<T>[],
  mustOwnAmounts: UintRange<T>,
  mustSatisfyForAllAssets: boolean,

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

export function convertAsset<T extends NumberType, U extends NumberType>(
  item: Asset<T>,
  convertFunction: (item: T) => U
): Asset<U> {
  const { collectionId, assetIds, ownershipTimes, mustOwnAmounts, ...rest } = item;
  let isCollectionIdNumeric = false;
  try {
    BigInt(collectionId as any);
    isCollectionIdNumeric = true;
  } catch (e) {
    isCollectionIdNumeric = false;
  }

  return {
    ...rest,
    collectionId: isCollectionIdNumeric ? convertFunction(collectionId as any) : collectionId as string,
    assetIds: assetIds.map(id => {
      if (typeof id === 'string') {
        return id;
      }
      return {
        start: convertFunction(id.start),
        end: convertFunction(id.end),
      }
    }),
    ownershipTimes: ownershipTimes?.map(time => ({
      start: convertFunction(time.start),
      end: convertFunction(time.end),
    })),
    mustOwnAmounts: {
      start: convertFunction(mustOwnAmounts.start),
      end: convertFunction(mustOwnAmounts.end),
    },
  }
}

export function convertChallengeParams<T extends NumberType, U extends NumberType>(
  item: ChallengeParams<T>,
  convertFunction: (item: T) => U
): ChallengeParams<U> {
  const { assets, ...rest } = item;
  return {
    ...rest,
    assets: assets?.map(asset => convertAsset(asset, convertFunction)),
  }
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
   * If true, we do not check timestamps (expirationDate / notBefore). This is useful if you are verifying a challenge that is expected to be verified at a future time.
   */
  skipTimestampVerification?: boolean,

  /**
   * If true, we do not check asset ownership. This is useful if you are verifying a challenge that is expected to be verified at a future time.
   */
  skipAssetVerification?: boolean,
}
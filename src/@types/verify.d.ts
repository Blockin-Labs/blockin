/**
 * Interface for EIP-4361 Challenge - Sign in With Ethereum
 * 
 * For more information and documentation, view the EIP proposal.
 * 
 * Note that we support prefixing resources with 'Asset ID: ' as well.
 */
export type ChallengeParams = {
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
    resources?: any
}

/**
 * Options that can be specified when calling createChallenge()
 */
export type CreateChallengeOptions = {
    // /**
    //  * Gets the latest block timestamp and overrides the inputted nonce, if there is one.
    //  * 
    //  * Note that if you specify this, you can also verify the recency of the challenge using
    //  * the verifyNonceWithBlockTimestamps and verificationTimeLimit in the verifyChallenge()
    //  * options.
    //  */
    // useBlockTimestampsForNonce?: boolean;
}

export type VerifyChallengeOptions = {
    /**
     * Map of asset IDs => number which specify the minimum balance required for a user to own to not throw an error.
     * 
     * If asset ID is not specified in this map, falls back on default value (1 or defaultMinimum, if defined).
     */
    assetMinimumBalancesMap?: any;
    /**
     * Default minimum balance is 1.
     * 
     * If this is defined, it sets the default minimum requirement for all asset IDs.
     */
    defaultMinimum?: number;
    /**
     * If true, it will check to ensure that the nonce in the challenge is still within the valid time range.
     * 
     * Default is 60 seconds. Can customize this time limit with verificationTimeLimit.
     */
    verifyNonceWithBlockTimestamps?: boolean;
    /**
     * Defines how recent a block timestamp nonce must be in order to not throw an error.
     * 
     * If this is not defined, default is 60 seconds. If defined, it will check if block timestamp
     * is within past verificationTimeLimit seconds. 
     * 
     * Uses seconds as the unit.
     */
    verificationTimeLimit?: number;
    /**
     * If specified, will assert that expectedDomain matches domain that was in the challenge.
     */
    expectedDomain?: string;
    /**
     * If specified, will assert that expectedUri matches uri that was in the challenge.
     */
    expectedUri?: string;
}
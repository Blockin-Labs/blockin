import { IChainDriver, IChainDriverWithHelpers } from './index.js';
import { AndGroup, AssetConditionGroup, AssetDetails, ChallengeParams, CreateChallengeOptions, NumberType, OrGroup, OwnershipRequirements, UintRange, VerifyChallengeOptions, convertAssetConditionGroup } from './types/verify.types';
import { compareObjects } from './utils';

const URI_REGEX: RegExp = /\w+:(\/?\/?)[^\s]+/;
const ISO8601_DATE_REGEX: RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/

const BigIntify = (item: NumberType) => {
  return BigInt(item);
}

function getChainForAddress(address: string) {
  let addr: string = address;
  if (addr.startsWith('0x')) {
    return 'Ethereum';
  } else if (addr.startsWith('cosmos')) {
    return 'Cosmos';
  } else if (address.length == 44) {
    return 'Solana';
  } else if (address.startsWith('bc')) {
    return 'Bitcoin';
  }

  return 'Web3'
}


/**
 * Creates a challenge that is well-formed according to EIP-4361 - Sign in With Ethereum. Some
 * slight modifications to EIP-4361 for our library include 1) any blockchain's native address, signature,
 * and verification schemes are supported and 2) in resources, one may prefix an asset with 'Asset ID: '
 * to specify micro-authorizations or role-based access using an on-chain asset.
 * 
 * @param challengeParams - JSON object with the challenge details such as domain, uri, statement, address, etc.
 * @param options - JSON object speicfying any additional options when creating the challenge
 * @returns Well-formed challenge string to be signed by the user, if successsful. Error string is returned
 * upon failure.
 */
export function createChallenge<T extends NumberType>(challengeParams: ChallengeParams<T>, options?: CreateChallengeOptions): string {
  /**
   *  This function should remain completely ChainDriver free. ChainDriver dependencies tend to mess up the
   * React component generation in the browser.
   */

  const {
    domain,
    statement,
    address,
    uri,
    nonce,
    version = "1",
    chainId = "1",
    issuedAt = new Date().toISOString(),
    expirationDate = undefined,
    notBefore = undefined,
    resources = undefined,
    assetOwnershipRequirements = undefined
  } = challengeParams;

  try {
    const challenge: ChallengeParams<T> = {
      domain,
      statement,
      address,
      uri,
      version,
      chainId,
      nonce,
      issuedAt,
      expirationDate,
      notBefore,
      resources,
      assetOwnershipRequirements
    }

    validateChallengeObjectIsWellFormed(challenge); // will throw error if invalid

    return constructChallengeStringFromChallengeObject(challenge);
  } catch (error: unknown) {
    throw `${error} - ${challengeParams.toString()}`;
  }
}

/**
 * verifyChallenge always checks three things: 1) originalChallenge was signed correctly by the user, 2) the
 * challenge is still well-formed and valid at the present time, and 3) the user owns all requested assets
 * in their wallet upon verification.
 * @param message - The string that represent the original challenge.
 * @param signature - The result of signing the message, formatted to the chain's specifications
 * @param options - Additional checks to perform when verifying the challenge.
 * @returns Returns { message: 'success' } object upon success. Throws an error if challenge is invalid.
 */
export async function verifyChallenge<T extends NumberType>(
  chainDriver: IChainDriver<NumberType> | undefined,
  message: string,
  signature: string,
  options?: VerifyChallengeOptions
) {
  const verificationData: any = {};
  const generatedEIP4361ChallengeStr: string = message;
  const convertFunction = BigIntify;
  const challenge = constructChallengeObjectFromString(generatedEIP4361ChallengeStr, convertFunction);

  if (options?.beforeVerification) {
    await options.beforeVerification(challenge);
  }

  validateChallengeObjectIsWellFormed(challenge);
  // console.log("Success: Constructed challenge from string and verified it is well-formed.");

  const currDate = new Date();
  verificationData.verificationTime = currDate;

  const skipTimestampVerification = options?.skipTimestampVerification ?? false;
  if (!skipTimestampVerification) {
    if (challenge.expirationDate && currDate >= new Date(challenge.expirationDate)) {
      throw `Challenge expired: ${challenge.expirationDate}`
    }

    if (challenge.notBefore && currDate <= new Date(challenge.notBefore)) {
      throw `Challenge invalid until: ${challenge.notBefore}`
    }
  }

  if (options?.earliestIssuedAt) {
    const earliestIssuedAt = new Date(options.earliestIssuedAt);
    if (!challenge.issuedAt) {
      throw `Challenge issued at date is missing but specified earliestIssuedAt: ${options.earliestIssuedAt}`
    }

    if (new Date(challenge.issuedAt) < earliestIssuedAt) {
      throw `This sign in was issued too long ago: ${challenge.issuedAt}. Earliest allowed: ${earliestIssuedAt}`
    }
  }

  if (options?.issuedAtTimeWindowMs) {
    const earliestIssuedAt = new Date(Date.now() - options.issuedAtTimeWindowMs);
    if (!challenge.issuedAt) {
      throw `Challenge issued at date is missing but specified issuedAtTimeWindowMs: ${options.issuedAtTimeWindowMs}`
    }

    if (new Date(challenge.issuedAt) < earliestIssuedAt) {
      throw `This sign in was issued too long ago: ${challenge.issuedAt}. Must be issued less than ${options.issuedAtTimeWindowMs / 1000} seconds ago`
    }
  }

  const toSkipSignatureVerification = options?.skipSignatureVerification ?? false;
  if (!toSkipSignatureVerification) {
    if (!chainDriver) throw `ChainDriver is required to verify assets`;
    await verifyChallengeSignature(chainDriver, message, signature)
  }

  if (options?.expectedChallengeParams) {
    //convert any fields that need to be converted to BigInt
    //This also handles the undefined stuff
    if (options.expectedChallengeParams.assetOwnershipRequirements) options.expectedChallengeParams.assetOwnershipRequirements = convertAssetConditionGroup(options.expectedChallengeParams.assetOwnershipRequirements, convertFunction, true);
    if (challenge.assetOwnershipRequirements) challenge.assetOwnershipRequirements = convertAssetConditionGroup(challenge.assetOwnershipRequirements, convertFunction, true);


    for (const key of Object.keys(options?.expectedChallengeParams ?? {})) {

      const expected = options?.expectedChallengeParams[key as keyof ChallengeParams<NumberType>];
      const actual = challenge[key as keyof ChallengeParams<NumberType>];

      if (compareObjects(expected, actual) !== true) {
        throw `unexpected value for ${key}: ${JSON.stringify(challenge[key as keyof ChallengeParams<NumberType>])} !== ${JSON.stringify(options?.expectedChallengeParams[key as keyof ChallengeParams<NumberType>] ?? 'undefined')}`;
      }
    }
  }


  const toSkipAssetVerification = options?.skipAssetVerification ?? false;
  if (challenge.resources || challenge.assetOwnershipRequirements) {
    if (!toSkipAssetVerification) {
      if (!chainDriver) throw `ChainDriver is required to verify assets`;
      const assetLookupData = await verifyAssets(chainDriver, challenge.address, (challenge.resources ?? []), challenge.assetOwnershipRequirements ?? undefined, options?.balancesSnapshot);
      verificationData.assetLookupData = assetLookupData
    }
  }

  return {
    message: `Successfully granted access via Blockin`, success: true, verificationData
  }
}

/**
 * Generates a nonce using the most recent block index. Can be called directly
 * or by specifiying the useBlockTimestampsForNonce flag in the createChallenge
 * options. verifyChallenge also offers two flags: (verifyNonceUsingBlockTimestamps?: boolean;
 * and verificationTimeLimit?: number;) that ensure timestamp of the block was recent when
 * verifying. 
 * @returns Last block index / timestamp / hash to be used as the nonce
 */
export async function generateNonceUsingLastBlockTimestamp(chainDriver: IChainDriverWithHelpers<NumberType>) {
  const nonce = await chainDriver.getLastBlockIndex()
  return nonce;
}

//Thanks ChatGPT :)
function assertAssetType<T extends NumberType>(asset: AssetDetails<T>): void {
  if (typeof asset.chain !== "string") throw new Error("Invalid chain type");
  if (
    typeof asset.collectionId !== "string"
  ) {
    BigInt(asset.collectionId); // will throw if not number type
  }

  if (!Array.isArray(asset.assetIds)) throw new Error("Invalid assetIds type");
  if (
    !asset.assetIds.every(
      (id) =>
        typeof id === "string" ||
        (typeof id === "object" &&
          BigInt(id.start) <= BigInt(id.end) &&
          BigInt(id.start) >= 0 &&
          BigInt(id.end) >= 0
        )
    )
  )
    throw new Error("Invalid assetIds type");
  if (
    asset.ownershipTimes &&
    !Array.isArray(asset.ownershipTimes)
  )
    throw new Error("Invalid ownershipTimes type");
  if (
    asset.ownershipTimes &&
    !asset.ownershipTimes.every(
      (time) =>
        typeof time === "string" ||
        (typeof time === "object" &&
          (typeof time === "object" &&
            BigInt(time.start) <= BigInt(time.end) &&
            BigInt(time.start) >= 0 &&
            BigInt(time.end) >= 0
          )
        ))
  )
    throw new Error("Invalid ownershipTimes type");
  if (
    !(
      (typeof asset.mustOwnAmounts === "object" &&
        BigInt(asset.mustOwnAmounts.start) <= BigInt(asset.mustOwnAmounts.end) &&
        BigInt(asset.mustOwnAmounts.start) >= 0 &&
        BigInt(asset.mustOwnAmounts.end) >= 0
      )
    )) throw new Error("Invalid mustOwnAmounts type");
}

function parseAssetConditionGroup<T extends NumberType>(lines: string[], convertFunction: (item: NumberType) => T): AssetConditionGroup<T> {

  //lines 0 and 1 are same whitespace
  const isAllCondition = lines[0].trim().includes('(satisfied if all')
  const isOrCondition = lines[0].trim().includes('(satisfied if one')

  //Little weird bc normal ones are not an array but $and and $or are
  //For normal ones, we are already at the Requirement X line and we want to parse the whole condition until Requirement X+1 as its own non-array object
  //For $and and $or, we need to parse everything indented as a single array
  //We add two lines bc we have Requirement X: then Must satisfy line

  //Pretty much, if we have an $and or $or, we will have the following
  //Requirement X:
  //Must satisfy...
  //  Requirement 1: 
  //  ...
  // We want to parse everything indented as a single array ($and or $or)

  //If we are parsing a non $and or $or, we will already be indented to the Requirement X line we want to parse
  //We want to parse everything on the same indent level as the Requirement X line
  //If this is the case, we can assume that we have no more $ands or $ors going down the tree (this is the leaf assets)
  let nextIndentDepth = lines[0].search(/\S/);
  if (isAllCondition || isOrCondition) {
    nextIndentDepth = lines[1].search(/\S/);
  }

  //Find the lines with matching depths = to the first lines depth
  const idxs = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].search(/\S/) === nextIndentDepth) {
      idxs.push(i);
      i++; //avoid the edge case where the next line is the same depth ($ands and $ors)
    }
  }
  idxs.push(lines.length);

  const andItem: AndGroup<T> = { $and: [] };
  const orItem: OrGroup<T> = { $or: [] };

  //In all of these the startIdx should be the next Requirement line to parse
  if (isAllCondition) {
    //Parse all subsequent conditions as an array of asset details and options
    andItem['$and'] = [];
    for (let i = 0; i < idxs.length - 1; i++) {
      andItem['$and'].push(parseAssetConditionGroup(lines.slice(idxs[i], idxs[i + 1]), convertFunction));
    }

    return andItem as AssetConditionGroup<T>;
  } else if (isOrCondition) {
    //Parse all subsequent conditions as an array of asset details and options
    orItem['$or'] = [];
    for (let i = 0; i < idxs.length - 1; i++) {
      orItem['$or'].push(parseAssetConditionGroup(lines.slice(idxs[i], idxs[i + 1]), convertFunction));
    }

    return orItem as AssetConditionGroup<T>;
  } else {
    //Parse 
    const assets: AssetDetails<T>[] = [];
    let options: { numMatchesForVerification?: T } = {};
    const trimmedLine = lines[0].trim();
    if (trimmedLine.includes('(must satisfy for a minimum of')) {
      const numMatches = trimmedLine.split(" ")[9];
      options = { numMatchesForVerification: convertFunction(numMatches) };
    }


    for (let i = 0; i < idxs.length - 1; i++) {

      const assetDetails = parseChallengeAssetDetails(lines.slice(idxs[i], idxs[i + 1]), convertFunction);
      assets.push(...assetDetails.assets);
      if (options) {
        options.numMatchesForVerification = options.numMatchesForVerification ? convertFunction(options.numMatchesForVerification) : undefined;
      }
    }

    return convertAssetConditionGroup({ assets, options }, convertFunction);
  }
}

export function parseChallengeAssets<T extends NumberType, U extends NumberType>(challengeString: string, convertFunction: (item: NumberType) => T): AssetConditionGroup<T> | undefined {
  const assetGroup: AssetConditionGroup<T> | undefined = undefined;
  const lines = challengeString.split("\n");
  const assetIdx = lines.findIndex(line => line.trim().startsWith('Asset Ownership Requirements:'));
  if (assetIdx === -1) return undefined;

  const assetLines = lines.slice(assetIdx + 1);
  return parseAssetConditionGroup(assetLines, convertFunction);
}

function parseChallengeAssetDetails<T extends NumberType, U extends NumberType>(lines: string[], convertFunction: (item: U) => T): { assets: AssetDetails<T>[] } {

  const assets: AssetDetails<T>[] = [];
  let currentAsset: Partial<AssetDetails<T>> | null = null;

  for (const line of lines) {

    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("Chain:")) {
      if (currentAsset) {
        if (currentAsset.assetIds) {
          assets.push(currentAsset as AssetDetails<T>);
        }
      }
      currentAsset = { chain: trimmedLine.substring(7).trim() };
    } else if (trimmedLine.startsWith("Collection ID:")) {
      if (currentAsset) {
        try {
          currentAsset.collectionId = convertFunction(trimmedLine.substring(15).trim() as U);
        } catch (e) {
          currentAsset.collectionId = trimmedLine.substring(15).trim();
        }
      }
    } else if (trimmedLine.startsWith("Asset IDs:")) {
      if (currentAsset) {
        if (!currentAsset.assetIds) {
          currentAsset.assetIds = [];
        }
        const range = trimmedLine.substring(10).trim().split(" to ");
        currentAsset.assetIds.push({ start: convertFunction(range[0] as U), end: convertFunction(range[1] as U) } as UintRange<T>);
      }
    } else if (trimmedLine.startsWith("Ownership Times:")) {
      if (currentAsset) {
        if (!currentAsset.ownershipTimes) {
          currentAsset.ownershipTimes = [];
        }

        const hasOnwards = trimmedLine.endsWith("onwards");
        if (hasOnwards) {
          const range = trimmedLine.substring(17).trim().split(" onwards");
          const firstDate = new Date(range[0].trim());
          currentAsset.ownershipTimes.push({
            start: convertFunction(firstDate.valueOf() as U),
            end: convertFunction("18446744073709551615" as U),
          });
        } else {
          const range = trimmedLine.substring(17).trim().split(" to ");
          currentAsset.ownershipTimes.push({
            start: convertFunction(new Date(range[0].substring(0, range[0].length).trim()).valueOf() as U),
            end: convertFunction(new Date(range[1].substring(0, range[1].length).trim()).valueOf() as U),
          });
        }
      }
    } else if (trimmedLine.startsWith("Ownership Amounts: x")) {
      if (currentAsset) {
        const range = trimmedLine.substring(12).trim().split(" to ");
        const firstAmount = range[0].substring(0, range[0].length - 5).trim().substring(1); //-5 to account for (min) (max)
        const secondAmount = range[1].substring(0, range[1].length - 5).trim().substring(1);
        currentAsset.mustOwnAmounts = {
          start: convertFunction(firstAmount as U),
          end: convertFunction(secondAmount as U),
        }
      }
    } else if (trimmedLine.startsWith("Ownership Amount: x")) {
      if (currentAsset) {
        const range = trimmedLine.substring(25 - 8).trim().split(" to ");
        const firstAmount = range[0].substring(1).trim();
        currentAsset.mustOwnAmounts = {
          start: convertFunction(firstAmount as U),
          end: convertFunction(firstAmount as U),
        }
      }
    } else if (trimmedLine.startsWith("Ownership Time: ")) {
      if (currentAsset) {
        if (!currentAsset.ownershipTimes) {
          currentAsset.ownershipTimes = [];
        }
        const range = trimmedLine.substring(15).trim();

        if (range === "Authentication Time") {

        } else {
          currentAsset.ownershipTimes.push({
            start: convertFunction(new Date(range).valueOf() as U),
            end: convertFunction(new Date(range).valueOf() as U),
          });
        }
      }
    } else if (trimmedLine.startsWith('- Sign-In Time')) {

    } else if (trimmedLine.startsWith('Other:')) {
      if (currentAsset) {
        currentAsset.additionalCriteria = trimmedLine.substring(20).trim();
      }
    } else if (trimmedLine.startsWith("Asset ID: ")) {
      if (currentAsset) {
        if (!currentAsset.assetIds) {
          currentAsset.assetIds = [];
        }
        const range = trimmedLine.substring(10).trim();
        currentAsset.assetIds.push(range);
      }
    }
  }

  if (currentAsset && currentAsset.assetIds && currentAsset.chain && currentAsset.collectionId && currentAsset.mustOwnAmounts) {
    assets.push(currentAsset as AssetDetails<T>);
  }

  return {
    assets,
  }
}

/**
 * Validates the object is well-formed according to the EIP-4361 interface, plus our additional add-ons
 * to the interface for Blockin. 
 * @param challenge - Valid JSON challenge object
 */
export function validateChallengeObjectIsWellFormed<T extends NumberType>(challenge: ChallengeParams<T>) {
  if (!URI_REGEX.test(challenge.domain)) {
    throw `Inputted domain (${challenge.domain}) is not a valid URI`;
  }

  /**
   * We only check for existence of an address here for Rollup React purposes (we don't use ChainDriver's isValidAddress). 
   * Will not be able to generate a valid signature with an invalid address, however.
   */
  if (!challenge.address) {
    throw `No address specified or address is invalid`;
  }

  if (!URI_REGEX.test(challenge.uri)) {
    throw `Inputted URI (${challenge.uri}) is not a valid URI`;
  }

  if (!challenge.nonce) {
    throw `No nonce (${challenge.nonce}) specified`;
  }

  if (challenge.issuedAt && !ISO8601_DATE_REGEX.test(challenge.issuedAt)) {
    throw `Issued at date (${challenge.issuedAt}) is not in valid ISO 8601 format`;
  }

  if (challenge.expirationDate && !ISO8601_DATE_REGEX.test(challenge.expirationDate)) {
    throw `Inputted expiration date (${challenge.expirationDate}) is not in valid ISO 8601 format`;
  }

  if (challenge.notBefore && !ISO8601_DATE_REGEX.test(challenge.notBefore)) {
    throw `Inputted not before date (${challenge.notBefore}) is not in valid ISO 8601 format`;
  }

  if (challenge.resources) {
    for (const resource of challenge.resources) {
      if (!URI_REGEX.test(resource)) {
        throw `Inputted resource in resources (${resource}) is not a valid URI`;
      }
    }
  }

  if (challenge.assetOwnershipRequirements) {
    validateAssetConditionGroup(challenge.assetOwnershipRequirements);
  }
}

function validateAssetConditionGroup<T extends NumberType>(assetConditionGroup: AssetConditionGroup<T>) {
  const andItem = assetConditionGroup as AndGroup<T>;
  const orItem = assetConditionGroup as OrGroup<T>;
  const ownershipRequirements = assetConditionGroup as OwnershipRequirements<T>;

  if (andItem['$and'] !== undefined) {
    for (const item of andItem['$and']) {
      validateAssetConditionGroup(item);
    }
  } else if (orItem['$or'] !== undefined) {
    for (const item of orItem['$or']) {
      validateAssetConditionGroup(item);
    }
  } else {
    for (const asset of ownershipRequirements.assets) {
      assertAssetType(asset);
    }
    if (ownershipRequirements.options) {
      try {
        if (ownershipRequirements.options.numMatchesForVerification) BigInt(ownershipRequirements.options.numMatchesForVerification)
      } catch (e) {
        throw new Error("Invalid numMatchesForVerification type");
      }
    }
  }
}

export function generateAssetConditionGroupString<T extends NumberType>(assetConditionGroup: AssetConditionGroup<T>, depth: number = 0, bulletNumber: number, parentBullet: number): string {
  let message = "";
  const andItem = assetConditionGroup as AndGroup<T>;
  const orItem = assetConditionGroup as OrGroup<T>;
  const ownershipRequirements = assetConditionGroup as OwnershipRequirements<T>;

  const depthLetter = String.fromCharCode(65 + depth);
  const nextDepthLetter = String.fromCharCode(65 + depth + 1);
  message += ' '.repeat(depth * 2) + `- Requirement ${depthLetter}${parentBullet}-${bulletNumber}`;
  if (andItem['$and'] !== undefined) {
    message += ` (satisfied if all of ${nextDepthLetter}${bulletNumber} are satisfied):\n`;
    for (let i = 0; i < andItem['$and'].length; i++) {
      message += generateAssetConditionGroupString(andItem['$and'][i], depth + 1, i + 1, bulletNumber);
    }
  } else if (orItem['$or'] !== undefined) {
    message += ` (satisfied if one of ${nextDepthLetter}${bulletNumber} is satisfied):\n`;
    for (let i = 0; i < orItem['$or'].length; i++) {
      message += generateAssetConditionGroupString(orItem['$or'][i], depth + 1, i + 1, bulletNumber);
    }
  } else {

    const groupOptions = ownershipRequirements.options;
    if (groupOptions?.numMatchesForVerification && groupOptions.numMatchesForVerification) {
      message += ` (must satisfy for a minimum of ${groupOptions.numMatchesForVerification} of the asset IDs):\n`;
    } else {
      message += `:\n`;
    }
    for (const asset of ownershipRequirements.assets) {
      message += ' '.repeat(depth * 2 + 2) + `  Chain: ${asset.chain}\n`;
      message += ' '.repeat(depth * 2 + 2) + `  Collection ID: ${asset.collectionId}\n`;

      if (asset.assetIds) {

        for (const assetId of asset.assetIds) {
          if (typeof assetId === "string") {
            message += ' '.repeat(depth * 2 + 4) + `Asset ID: ${assetId}\n`;
          } else if (typeof assetId === "object") {
            message += ' '.repeat(depth * 2 + 4) + `Asset IDs: ${assetId.start} to ${assetId.end}\n`;
          }
        }
      }

      if (asset.ownershipTimes && asset.ownershipTimes.length > 0) {
        for (const time of asset.ownershipTimes) {
          if (typeof time === "string") {
            message += ' '.repeat(depth * 2 + 4) + `Ownership Time: ${new Date(time).toISOString}\n`;
          } else if (typeof time === "object") {
            const startDate = new Date(Number(BigInt(time.start))).toISOString();
            const endDateNumber = BigInt(time.end);
            if (endDateNumber > Number.MAX_SAFE_INTEGER) {
              message += ' '.repeat(depth * 2 + 4) + `Ownership Times: ${startDate} onwards\n`;
            } else {
              message += ' '.repeat(depth * 2 + 4) + `Ownership Times: ${startDate} to ${new Date(Number(BigInt(time.end))).toISOString()}\n`;
            }
          }
        }
      } else {
        message += ' '.repeat(depth * 2 + 4) + `Ownership Time: Authentication Time\n`;
      }

      if (asset.mustOwnAmounts) {
        if (asset.mustOwnAmounts.start === asset.mustOwnAmounts.end) {
          message += ' '.repeat(depth * 2 + 4) + `Ownership Amount: x${asset.mustOwnAmounts.start}\n`;
        }
        else {
          message += ' '.repeat(depth * 2 + 4) + `Ownership Amounts: x${asset.mustOwnAmounts.start} (min) to x${asset.mustOwnAmounts.end} (max)\n`;
        }
      }

      if (asset.additionalCriteria) {
        message += ' '.repeat(depth * 2 + 4) + `Other: ${asset.additionalCriteria}\n`;
      }

      message += '\n';
    }
  }

  return message;
}

/**
 * Parses a JSON object that specifies the challenge fields and returns a well-formatted EIP-4361 string. 
 * Note that there is no validity checks on the inputs. It is a precondition that it is well-formed. 
 * @param challenge - Well-formatted JSON object specifying the EIP-4361 fields.
 * @returns - Well-formatted EIP-4361 challenge string to be signed.
 */
function constructChallengeStringFromChallengeObject<T extends NumberType>(challenge: ChallengeParams<T>): string {
  const chain = getChainForAddress(challenge.address);

  let message = "";
  message += `${challenge.domain} wants you to sign in with your ${chain} account:\n`
  message += `${challenge.address}\n\n`;
  if (challenge.statement) {
    message += `${challenge.statement}\n`;
  }
  message += `\n`;
  message += `URI: ${challenge.uri}\n`;
  message += `Version: ${challenge.version}\n`;
  message += `Chain ID: ${challenge.chainId}\n`;
  message += `Nonce: ${challenge.nonce}\n`;
  message += `Issued At: ${challenge.issuedAt}`;
  if (challenge.expirationDate) {
    message += `\nExpiration Time: ${challenge.expirationDate}`;
  }
  if (challenge.notBefore) {
    message += `\nNot Before: ${challenge.notBefore}\n`;
  }
  if (challenge.resources) {
    message += `\nResources:`;
    for (const resource of challenge.resources) {
      message += `\n- ${resource}`
    }
  }

  if (challenge.assetOwnershipRequirements) {
    message += `\nAsset Ownership Requirements:\n`;
    message += generateAssetConditionGroupString(challenge.assetOwnershipRequirements, 0, 1, 1);
  }

  return message;
}

/**
 * Constructs a valid JSON challenge object from a valid well-formed EIP-4361 string. Note this
 * doesn't check for validity at all. See the EIP-4361 proposal for more details about exact formatting
 * requirements of the string.
 * @param challenge - Valid EIP-4361 challenge string
 * @returns JSON challenge object with all specified EIP-4361 fields
 */
export function constructChallengeObjectFromString<T extends NumberType>(challenge: string, convertFunction: (item: NumberType) => T): ChallengeParams<T> {
  const messageArray = challenge.split("\n");
  const domain = messageArray[0].split(' ')[0];
  const address = messageArray[1];
  const statement = messageArray[3];
  const uri = messageArray[5].split(':').slice(1).join(':').trim();
  const version = messageArray[6].split(':')[1].trim();
  const chainId = messageArray[7].split(':')[1].trim();
  const nonce = messageArray[8].split(':')[1].trim();
  const issuedAt = messageArray[9].split(':').slice(1).join(':').trim();

  let expirationDate;
  let notBefore;
  let resources = [];
  let assetOwnershipRequirements;

  for (let i = 10; i < messageArray.length; i++) {
    if (messageArray[i].indexOf('Expiration Time:') !== -1) {
      expirationDate = messageArray[i].split(':').slice(1).join(':').trim();
    } else if (messageArray[i].indexOf('Not Before:') !== -1) {
      notBefore = messageArray[i].split(':').slice(1).join(':').trim();
    } else if (messageArray[i].indexOf('Resources:') !== -1) {
      resources = [];
      for (let j = i + 1; j < messageArray.length; j++) {
        if (messageArray[j].indexOf('Asset Ownership Requirements:') !== -1) {
          break;
        }
        const resource = messageArray[j].split(' ').slice(1).join(' ').trim();
        resources.push(resource);
      }
    } else if (messageArray[i].indexOf('Asset Ownership Requirements:') !== -1) {
      assetOwnershipRequirements = parseChallengeAssets(challenge, convertFunction);
      break;
    }
  }

  return { domain, address, statement, expirationDate, notBefore, resources, issuedAt, uri, version, chainId, nonce, assetOwnershipRequirements };
}


/**
 * Verifies a challenge is signed by the given addresses. Throws error if invalid. Specific to 
 * specified chain driver.
 * @param message - The string that represent the original challenge.
 * @param signature - The result of signing the message, formatted to the chain's specifications
 */
async function verifyChallengeSignature<T extends NumberType>(chainDriver: IChainDriver<T>, message: string, signature: string) {
  await chainDriver.verifySignature(message, signature);
}

/**
 * Verifies an address owns all specified resources. Ignores everything that doesn't start with 'Asset ID: '. 
 * Defaults to succeeding if user has a balance of >= 1 for every asset.  
 * @param address - Address to verify
 * @param resources - String array of URIs or Asset IDs. This function ignores every resource that doesn't start
 * with 'Asset ID: '
 * @param assetMinimumBalancesRequiredMap - Optional, but here, one can define a JSON object mapping of 
 * 'assetIDs' => minimumBalances. If assetMinimumBalancesRequiredMap[assetId] exists, it will check that the user owns 
 * more than the specified minimum balance. If not defined, will use the default.
 * @param defaultMinimum - Optional. Default is normally set to check if user owns >= 1. Here, you can specify a
 * new default minimum for all assets to fallback on if not defined in assetMinimumBalancesRequiredMap.
 * @returns If successful, verification was successful. Looked up asset data is also returned for convenience. 
 * Throws error if invalid.
 */
async function verifyAssets<T extends NumberType>(chainDriver: IChainDriver<T>, address: string, resources: string[], assets: AssetConditionGroup<T> | undefined, balancesSnapshot?: object) {
  const assetLookupData = await chainDriver.verifyAssets(address, resources, assets, balancesSnapshot);
  return assetLookupData;
}

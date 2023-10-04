import { UintRange } from "bitbadgesjs-proto";
import { NumberType } from 'bitbadgesjs-utils';
import { IChainDriver } from './types/ChainDriver.types.js';
import { Asset, ChallengeParams, CreateChallengeOptions, VerifyChallengeOptions } from './types/verify.types.js';

const URI_REGEX: RegExp = /\w+:(\/?\/?)[^\s]+/;
const ISO8601_DATE_REGEX: RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/

var chainDriver: any;

export function initializeVerify<T extends NumberType>(driver: IChainDriver<T>) {
  chainDriver = driver
}

/**
 * Creates a challenge that is well-formed according to EIP-4361 - Sign in With Ethereum. Some
 * slight modifications to EIP-4361 for our library include 1) any blockchain's native address, signature,
 * and verification schemes are supported and 2) in resources, one may prefix an asset with 'Asset ID: '
 * to specify micro-authorizations or role-based access using an on-chain asset.
 * 
 * 
 * @param challengeParams - JSON object with the challenge details such as domain, uri, statement, address, etc.
 * @param chainName - Name of the blockchain to include in the statement - "Sign in with your ____ account"
 * @param options - JSON object speicfying any additional options when creating the challenge
 * @returns Well-formed challenge string to be signed by the user, if successsful. Error string is returned
 * upon failure.
 */
export async function createChallenge<T extends NumberType>(challengeParams: ChallengeParams<T>, chainName?: string, options?: CreateChallengeOptions): Promise<string> {
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
    assets = undefined
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
      assets
    }

    validateChallengeObjectIsWellFormed(challenge); // will throw error if invalid

    return constructChallengeStringFromChallengeObject(challenge, chainName);
  } catch (error: unknown) {
    throw `Error: ${error} - ${challengeParams.toString()}`;
  }
}

/**
 * verifyChallenge always checks three things: 1) originalChallenge was signed correctly by the user, 2) the
 * challenge is still well-formed and valid at the present time, and 3) the user owns all requested assets
 * in their wallet upon verification.
 * @param originalChallenge - The bytes (Uint8 Array) that were signed that represent the original challenge.
 * @param signedChallenge - The result of signing the bytes as a Uint8Array
 * @param options - Additional checks to perform when verifying the challenge.
 * @returns Returns { message: 'success' } object upon success. Throws an error if challenge is invalid.
 */
export async function verifyChallenge<T extends NumberType, U extends NumberType>(originalChallenge: Uint8Array, signedChallenge: Uint8Array, convertFunction: (item: U) => T, options?: VerifyChallengeOptions) {
  const verificationData: any = {};
  const generatedEIP4361ChallengeStr: string = await getChallengeStringFromBytes(originalChallenge);
  const challenge: ChallengeParams<T> = constructChallengeObjectFromString(generatedEIP4361ChallengeStr, convertFunction);

  if (options?.beforeVerification) {
    await options.beforeVerification(challenge);
  }

  validateChallengeObjectIsWellFormed(challenge);
  // console.log("Success: Constructed challenge from string and verified it is well-formed.");

  const currDate = new Date();
  verificationData.verificationTime = currDate;
  if (challenge.expirationDate && currDate >= new Date(challenge.expirationDate)) {
    throw `Error: Challenge expired: ${challenge.expirationDate}`
  }

  if (challenge.notBefore && currDate <= new Date(challenge.notBefore)) {
    throw `Error: Challenge invalid until: ${challenge.notBefore}`
  }

  const originalAddress = challenge.address;
  await verifyChallengeSignature(originalChallenge, signedChallenge, originalAddress)
  // console.log("Success: Signature matches address specified within the challenge.");

  if (options?.expectedChallengeParams) {
    for (const key of Object.keys(options?.expectedChallengeParams ?? {})) {
      if (challenge[key as keyof ChallengeParams<T>] !== options?.expectedChallengeParams[key as keyof VerifyChallengeOptions['expectedChallengeParams']]) {
        throw `Error: unexpected value for ${key}: ${challenge[key as keyof ChallengeParams<T>]}. Expected ${options?.expectedChallengeParams[key as keyof VerifyChallengeOptions['expectedChallengeParams']]}`
      }
    }
  }


  if (challenge.resources || challenge.assets) {
    const assetLookupData = await verifyAssets(challenge.address, (challenge.resources ?? []), (challenge.assets ?? []), options?.balancesSnapshot);
    verificationData.assetLookupData = assetLookupData
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
export async function generateNonceUsingLastBlockTimestamp() {
  const nonce = await chainDriver.getLastBlockIndex()
  return nonce;
}

//Thanks ChatGPT :)
function assertAssetType<T extends NumberType>(asset: Asset<T>): void {
  if (typeof asset.chain !== "string") throw new Error("Invalid chain type");
  if (
    typeof asset.collectionId !== "string" &&
    typeof asset.collectionId !== "number"
  )
    throw new Error("Invalid collectionId type");
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


export function parseChallengeAssets<T extends NumberType, U extends NumberType>(challengeString: string, convertFunction: (item: U) => T): Asset<T>[] {
  const assets: Asset<T>[] = [];
  const lines = challengeString.split("\n");

  let currentAsset: Partial<Asset<T>> | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("- Chain:")) {
      if (currentAsset) {
        if (currentAsset.assetIds) {
          assets.push(currentAsset as Asset<T>);
        }
      }
      currentAsset = { chain: trimmedLine.substring(9).trim() };
    } else if (trimmedLine.startsWith("Collection ID:")) {
      if (currentAsset) {
        currentAsset.collectionId = trimmedLine.substring(15).trim();
      }
    } else if (trimmedLine.startsWith("- ID Range:")) {
      if (currentAsset) {
        if (!currentAsset.assetIds) {
          currentAsset.assetIds = [];
        }
        const range = trimmedLine.substring(11).trim().split(" to ");
        currentAsset.assetIds.push({ start: convertFunction(range[0] as U), end: convertFunction(range[1] as U) } as UintRange<T>);
      }
    } else if (trimmedLine.startsWith("- Time Range:")) {
      if (currentAsset) {
        if (!currentAsset.ownershipTimes) {
          currentAsset.ownershipTimes = [];
        }
        const range = trimmedLine.substring(14).trim().split(" to ");
        currentAsset.ownershipTimes.push({
          start: convertFunction(new Date(range[0].substring(0, range[0].length - 5).trim()).valueOf() as U),
          end: convertFunction(new Date(range[1].substring(0, range[1].length - 5).trim()).valueOf() as U),
        });
      }
    } else if (trimmedLine.startsWith("- Range: x")) {
      if (currentAsset) {
        const range = trimmedLine.substring(9).trim().split(" to ");
        const firstAmount = range[0].substring(0, range[0].length - 5).trim().substring(1);
        const secondAmount = range[1].substring(0, range[1].length - 5).trim().substring(1);
        currentAsset.mustOwnAmounts = {
          start: convertFunction(firstAmount as U),
          end: convertFunction(secondAmount as U),
        }
      }
    } else if (trimmedLine.startsWith("- Amount: Exactly x")) {
      if (currentAsset) {
        const range = trimmedLine.substring(17).trim().split(" to ");
        const firstAmount = range[0].substring(1).trim();
        currentAsset.mustOwnAmounts = {
          start: convertFunction(firstAmount as U),
          end: convertFunction(firstAmount as U),
        }
      }
    } else if (trimmedLine.startsWith("- Time: ")) {
      if (currentAsset) {
        if (!currentAsset.ownershipTimes) {
          currentAsset.ownershipTimes = [];
        }
        const range = trimmedLine.substring(7).trim();
        currentAsset.ownershipTimes.push({
          start: convertFunction(new Date(range).valueOf() as U),
          end: convertFunction(new Date(range).valueOf() as U),
        });
      }
    } else if (trimmedLine.startsWith('- Sign-In Time')) {

    } else if (trimmedLine.startsWith('Additional Criteria:')) {
      if (currentAsset) {
        currentAsset.additionalCriteria = trimmedLine.substring(20).trim();
      }
    } else if (trimmedLine.startsWith("- ")) {
      if (currentAsset) {
        if (!currentAsset.assetIds) {
          currentAsset.assetIds = [];
        }
        const range = trimmedLine.substring(2).trim();
        currentAsset.assetIds.push(range);
      }
    }
  }

  if (currentAsset && currentAsset.assetIds && currentAsset.chain && currentAsset.collectionId && currentAsset.mustOwnAmounts) {
    assets.push(currentAsset as Asset<T>);
  }

  return assets;
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

  if (challenge.assets) {
    for (const asset of challenge.assets) {
      assertAssetType(asset);
    }
  }
}

/**
 * Parses a JSON object that specifies the challenge fields and returns a well-formatted EIP-4361 string. 
 * Note that there is no validity checks on the inputs. It is a precondition that it is well-formed. 
 * @param challenge - Well-formatted JSON object specifying the EIP-4361 fields.
 * @param chainName - Name of the blockchain to include in the statement - "Sign in with your ____ account"
 * @returns - Well-formatted EIP-4361 challenge string to be signed.
 */
export function constructChallengeStringFromChallengeObject<T extends NumberType>(challenge: ChallengeParams<T>, chainName?: string): string {
  let message = "";
  message += `${challenge.domain} wants you to sign in with your ${chainName ? chainName : 'Web3'} account:\n`
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

  if (challenge.assets) {
    message += `\nAssets:\n`;
    for (const asset of challenge.assets) {
      message += `- Chain: ${asset.chain}\n`;
      message += `  Collection ID: ${asset.collectionId}\n`;

      message += `  Asset IDs:\n`;
      for (const assetId of asset.assetIds) {
        if (typeof assetId === "string") {
          message += `    - ${assetId}\n`;
        } else if (typeof assetId === "object") {
          message += `    - ID Range: ${assetId.start} to ${assetId.end}\n`;
        }
      }

      message += `  Ownership Times:\n`;
      if (!asset.ownershipTimes) {
        message += `    - Sign-In Time\n`;
      }
      if (asset.ownershipTimes) {



        for (const time of asset.ownershipTimes) {
          if (typeof time === "string") {
            message += `    - Time: ${new Date(time).toISOString}\n`;
          } else if (typeof time === "object") {
            message += `    - Time Range: ${new Date(Number(BigInt(time.start))).toISOString()} (min) to ${new Date(Number(BigInt(time.end))).toISOString()} (max)\n`;
          }
        }
      }

      message += `  Ownership Amounts:\n`;
      if (typeof asset.mustOwnAmounts === "object") {
        if (asset.mustOwnAmounts.start === asset.mustOwnAmounts.end) {
          message += `    - Amount: Exactly x${asset.mustOwnAmounts.start}\n`;
        } else {
          message += `    - Range: x${asset.mustOwnAmounts.start} (min) to x${asset.mustOwnAmounts.end} (max)\n`;
        }
      }


      if (asset.additionalCriteria) {
        message += `  Additional Criteria: ${asset.additionalCriteria}\n`;
      }

      message += `\n`;
    }
  }


  return message;
}

/**
 * This function is called in order to parse the challenge string from the bytes that were signed.
 * It is specific to the specified chain driver. This function is needed because most signing
 * algorithms add a prefix to the string before signing, so this function attempts to undo that.
 * @param txnBytes - Original bytes that were signed as a Uint8Array
 * @returns Parses out and returns the challenge string that was signed
 */
async function getChallengeStringFromBytes(txnBytes: Uint8Array): Promise<string> {
  return chainDriver.parseChallengeStringFromBytesToSign(txnBytes);
}

/**
 * Constructs a valid JSON challenge object from a valid well-formed EIP-4361 string. Note this
 * doesn't check for validity at all. See the EIP-4361 proposal for more details about exact formatting
 * requirements of the string.
 * @param challenge - Valid EIP-4361 challenge string
 * @returns JSON challenge object with all specified EIP-4361 fields
 */
export function constructChallengeObjectFromString<T extends NumberType, U extends NumberType>(challenge: string, convertFunction: (item: U) => T): ChallengeParams<T> {

  const messageArray = challenge.split("\n");
  const domain = messageArray[0].split(' ')[0];
  const address = messageArray[1];
  const statement = messageArray[3];
  const uri = messageArray[5].split(' ')[1];
  const version = messageArray[6].split(':')[1].trim();
  const chainId = messageArray[7].split(':')[1].trim();
  const nonce = messageArray[8].split(':')[1].trim();
  const issuedAt = messageArray[9].split(':').slice(1).join(':').trim();

  let expirationDate;
  let notBefore;
  let resources = [];
  let assets = [];
  if (messageArray[10]) {
    if (messageArray[10].indexOf('Expiration Time:') != -1) {
      expirationDate = messageArray[10].split(':').slice(1).join(':').trim();
    } else if (messageArray[10].indexOf('Not Before:') != -1) {
      notBefore = messageArray[10].split(':').slice(1).join(':').trim();
    } else if (messageArray[10].indexOf('Resources:') != -1) {
      resources = [];
      for (let i = 11; i < messageArray.length; i++) {
        if (messageArray[i].indexOf('Assets:') != -1) {
          break;
        }
        const resource = messageArray[i].split(' ').slice(1).join(' ').trim();
        resources.push(resource);
      }
    } else if (messageArray[10].indexOf('Assets:') != -1) {
      assets = [];
      for (let i = 11; i < messageArray.length; i++) {
        const asset = messageArray[i].split(' ').slice(1).join(' ').trim();
        assets.push(JSON.parse(asset));
      }
    }
  }

  if (messageArray[11]) {
    if (messageArray[11].indexOf('Not Before:') != -1) {
      notBefore = messageArray[11].split(':').slice(1).join(':').trim();
    } else if (messageArray[11].indexOf('Resources:') != -1) {
      resources = [];
      for (let i = 12; i < messageArray.length; i++) {
        if (messageArray[i].indexOf('Assets:') != -1) {
          break;
        }
        const resource = messageArray[i].split(' ').slice(1).join(' ').trim();
        resources.push(resource);
      }
    } else if (messageArray[11].indexOf('Assets:') != -1) {
      assets = parseChallengeAssets(challenge, convertFunction);
    }
  }

  if (messageArray[12]) {
    if (messageArray[12].indexOf('Resources:') != -1) {
      resources = [];
      for (let i = 13; i < messageArray.length; i++) {
        if (messageArray[i].indexOf('Assets:') != -1) {
          break;
        }
        const resource = messageArray[i].split(' ').slice(1).join(' ').trim();
        resources.push(resource);
      }
    } else if (messageArray[12].indexOf('Assets:') != -1) {
      assets = parseChallengeAssets(challenge, convertFunction);
    }
  }

  if (messageArray[13]) {
    if (messageArray[13].indexOf('Assets:') != -1) {
      assets = parseChallengeAssets(challenge, convertFunction);
    }
  }


  return { domain, address, statement, expirationDate, notBefore, resources, issuedAt, uri, version, chainId, nonce, assets };

}

/**
 * Verifies a challenge is signed by the given addresses. Throws error if invalid. Specific to 
 * specified chain driver.
 * @param originalChallengeToUint8Array - Uint8Array of the original bytes that were signed
 * @param signedChallenge - Uint8Array of the signature bytes
 * @param originalAddress - string that specifies the address who signed these bytes
 */
async function verifyChallengeSignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string) {
  await chainDriver.verifySignature(originalChallengeToUint8Array, signedChallenge, originalAddress);
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
async function verifyAssets<T extends NumberType>(address: string, resources: string[], assets: Asset<T>[], balancesSnapshot?: object) {
  const assetLookupData = await chainDriver.verifyAssets(address, resources, assets, balancesSnapshot);
  return assetLookupData;
}

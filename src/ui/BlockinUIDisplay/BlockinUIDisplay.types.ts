import { ReactNode } from "react";
import { Asset, ChallengeParams, NumberType, convertAsset } from "../../types/verify.types.js";

/**
 * Defines schema for displaying a resource within the pop-up modal.
 */
export type PresetUri = {
  uri: string;
  name: string;
  description?: string
  frozen: boolean;
  defaultSelected: boolean;
  additionalDisplay?: ReactNode;
}

export interface AssetWithUIDetails<T extends NumberType> extends Asset<T> {
  name: string;
  description?: string | ReactNode;
  frozen: boolean;
  defaultSelected: boolean;
  additionalDisplay?: ReactNode;
}

export function convertAssetWithUIDetails<T extends NumberType, U extends NumberType>(
  item: AssetWithUIDetails<T>,
  convertFunction: (item: T) => U
): AssetWithUIDetails<U> {
  const { collectionId, assetIds, ownershipTimes, mustOwnAmounts, ...rest } = item;
  return {
    ...rest,
    ...convertAsset(item, convertFunction),
  }
}


/**
 * Expected return trype for signAndVerifyChallenge()
 */
export type SignAndVerifyChallengeResponse = {
  success: boolean,
  message: string
}


/**
 * Defines metadata details about a supported chain.
 */
export type SupportedChainMetadata = {
  name?: string;
  logo?: string;
  abbreviation?: string;
  chainIds?: string[];
  getAddressExplorerUrl?: (address: string) => string;
  getCollectionExplorerUrl?: (collectionId: string) => string;
  getTokenExplorerUrl?: (collectionId: string, tokenId: string) => string;
  getNameForAddress?: (address: string) => Promise<string | undefined>;
}

/**
 * Props to pass into the BlockinUIDisplay component
 */
export type BlockinUIDisplayProps<T extends NumberType> = {
  /**
   * String name of current selected chain to use. There are a few chains that are preset as supported chains. If
   * selectedChainName does not match any of the supported chains, you must specify selectedChainInfo to provide metadata 
   * about the chain.
   */
  selectedChainName: string,
  /**
   * This should be defined if selectedChainName is not in the preset supported chains. See the SupportedChainMetadata type.
   */
  selectedChainInfo?: SupportedChainMetadata,
  /**
   * If true, chain select will be hidden.
   */
  hideChainSelect?: boolean;

  /**
   * Here, we offer a place for you to add a custom React Node to display any additional information.
   */
  customDisplay?: ReactNode;

  /**
   * Address of the connected wallet. See getNameForAddress in selectedChainInfo for name resolutions, such as ENS.
   */
  address?: string;

  /**
   * Optional message to be displayed. Intended to display user privileges here, such as "Premium Plan" or "Red Team".
   */
  loggedInDetails?: string;

  /**
   * Valid CSS style JSON. Will be applied as an inline style to the button.
   */
  buttonStyle?: any,
  /**
   * Valid CSS style JSON. Will be applied as an inline style to the modal.
   */
  modalStyle?: any,

  /**
   * Defaults to false. If set to true, will hide the connect button and other connect props will be ignored.
   */
  hideConnect?: boolean,
  /**
   * Defaults to false. Determines whether to display the connect or disconnect button.  
   */
  connected?: boolean,
  /**
   * Function to be called when connect is clicked. Must update connected prop.
   */
  connect?: () => Promise<void>,
  /**
   * Function to be called when disconnect is clicked. Must update connected prop.
   */
  disconnect?: () => Promise<void>,

  /**
   * List of selectable options for supported blockchains. If a supported name,
   * you will only need to specify { name: string }, else you can optionally specify other
   * metadata as in the SupportedChainMetadata type.
   */
  chainOptions?: SupportedChainMetadata[],
  /**
   * Function that is called after a new chain is selected. You will have to update the selectedChainName prop here.
   */
  onChainUpdate?: (chain: SupportedChainMetadata) => Promise<void>

  /**
   * Defaults to false. If set to true, will hide the login button and other login props will be ignored.
   */
  hideLogin?: boolean,
  /**
   * Defaults to false. Determines whether to display the login or logout button.  
   */
  loggedIn?: boolean,
  /**
   * Function to be called when logout is clicked. Must update loggedIn prop.
   */
  logout?: () => Promise<void>,

  /**
   * EIP-4361 params that will make up the challenge. See ChallengeParams type.
   */
  challengeParams?: ChallengeParams<T>,

  /**
  * This function will need to handle all the functionality to a) sign the challenge, and b) verify the challenge.
  * 
  * Note that the Blockin library doesn't handle any signing functionality. 
  * When a user clicks sign-in, it will call thisfunction which is passed in as a prop. Once challenge is signed, 
  * you should use the (challenge, signature) pair for verification. The verification should typically be done on 
  * a backend because it will need a ChainDriver set with an API key. It is not recommended to be done on the 
  * frontend.
  * 
  * During verification, this is where you perform the following: 1) call Blockin's verifyChallenge() within your backend,
  * 2) include any other additional verification checks about the challenge (like nonce verification if using a custom scheme 
  * or assert anything else about the challenge details that should be expected), 3) if verification passes, update whatever is
  * needed on frontend and backend to authenticate the user (your methods of choice). 
  * 
  * Expects a response consistent with the SignAndVerifyChallengeResponse type. 
  * 
  * Must also update the loggedIn prop, if verified.
  */
  signAndVerifyChallenge?: (
    challenge: string
  ) => Promise<SignAndVerifyChallengeResponse>,

  /**
   * Resources to be displayed to sign-in with. See PresetResource type.
   */
  displayedResources?: PresetUri[],

  /**
   * Assets to be displayed to sign-in with.
   */
  displayedAssets?: AssetWithUIDetails<T>[],
  // To do in the future:
  // canSetExpirationDate: boolean,
  // canSetNotBeforeDate: boolean,


  /**
   * Hides the hover to learn more tooltip
   */
  hideConnectVsSignInHelper?: boolean,

  /**
  * If true, the user will be prompted to select a time for the challenge to expire. If false, the challenge will expire according to the passed in challenge params.
  */
  allowTimeSelect?: boolean,

  /**
   * maxTimeInFuture is the maximum amount of time in the future that a user can select for the challenge to expire (in Unix milliseconds). Defaults to no limit.
   * 
   */
  maxTimeInFuture?: number,
}
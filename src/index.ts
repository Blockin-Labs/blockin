export type {
  IChainDriver,
  UniversalTxn,
  IChainDriverWithHelpers,
  IGetAssetDetails,
  ILookupTransactionById,
  IGetChallengeStringFromBytesToSign,
  IVerifySignature,
  IVerifyAssets,
  IMakeAssetTxn,
  IMakeAssetTransferTxn,
  ISendTx,
  IGetAssets,
  IGetLastBlockIndex,
  IGetTimestampForBlock,
  IIsValidAddress,
  IGetPublicKey,

} from './types/ChainDriver.types'

export type {
  CreateAssetParams,
  CreateTransferAssetParams,
} from './types/auth.types'

export type {
  ChallengeParams,
  VerifyChallengeOptions,
  CreateChallengeOptions,
  AssetConditionGroup,
  AndGroup,
  OrGroup,
  OwnershipRequirements,
} from './types/verify.types'

export {
  convertAssetConditionGroup,
  convertChallengeParams,
} from './types/verify.types'

export {
  // convertAssetWithUIDetails,
} from './ui/BlockinUIDisplay/BlockinUIDisplay.types'

export type {
  SignAndVerifyChallengeResponse,
  PresetUri,
  AssetUIDetails,

  SupportedChainMetadata
} from './ui/BlockinUIDisplay/BlockinUIDisplay.types'

/**
 * We have removed ChainDrivers from being exported for a few reasons. 
 * 
 * 1) Package size becomes way too big
 * 2) Security considerations
 * 3) CJS and ESM support was not fully working with dependencies
 * 
 * We still provide the files in the ChainDrivers folder for convenience
 */
// export {
//     AlgoDriver
// } from './ChainDrivers/AlgoDriver'

export {
  createChallenge,
  verifyChallenge,
  constructChallengeObjectFromString,
  validateChallengeObjectIsWellFormed,
  generateNonceUsingLastBlockTimestamp,
  generateAssetConditionGroupString
} from './verify';
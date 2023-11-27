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
  
} from './types/ChainDriver.types.js'

export type {
  CreateAssetParams,
  CreateTransferAssetParams,
} from './types/auth.types.js'

export type {
  ChallengeParams,
  VerifyChallengeOptions,
  CreateChallengeOptions,
  Asset
} from './types/verify.types.js'

export type {
  SignAndVerifyChallengeResponse,
  PresetUri,
  PresetAsset,
  SupportedChainMetadata
} from './ui/BlockinUIDisplay/BlockinUIDisplay.types.js'

export {
  setChainDriver
} from './blockin.js'

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
// } from './ChainDrivers/AlgoDriver.js'

export {
  createAssetTxn,
  createAssetTransferTxn,
  sendTxn
} from './auth.js'

export {
  createChallenge,
  verifyChallenge,
  constructChallengeObjectFromString,
  constructChallengeStringFromChallengeObject,
  validateChallengeObjectIsWellFormed,
  generateNonceUsingLastBlockTimestamp
} from './verify.js';
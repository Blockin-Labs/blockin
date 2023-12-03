// This file handles creating, opting in to, and transfering an auth asset from resource to owner
import { IChainDriver, UniversalTxn } from './types/ChainDriver.types.js'
import { CreateAssetParams, CreateTransferAssetParams } from "./types/auth.types.js";
import { NumberType } from './types/verify.types.js';

var chainDriver: any

export function initializeAuth<T extends NumberType>(driver: IChainDriver<T>) {
  chainDriver = driver
}

/**
 * This function attempts to create a universal function that will create an asset on-chain. This 
 * uses the chain driver, so it is chain specific. Generates an unsigned asset creation transaction, 
 * and this is to be signed and broadcasted to the blockchain network. Note this may 
 * need an API key defined in your chain driver depending on your chain driver implementation.
 * @param createAssetParams - JSON object specifying universal asset creation fields like from, amount, 
 * decimals, etc. 
 * @returns If successful, will return a UniversalTxn object that specifies the bytes to sign and submit
 * to create a valid asset creation transaction. Throws upon error.
 */
export async function createAssetTxn(createAssetParams: CreateAssetParams): Promise<UniversalTxn> {
  const {
    from,
    to = 'Blockin',
    assetName = 'Blockin Access Token',
    assetURL = '',
    note = 'This is an access token created with Blockin',
    amount = 1,
    unitName = '',
    decimals = 0,
    total = 1,
    assetMetadata = '',
    extras = undefined
  } = createAssetParams

  return await chainDriver.makeAssetTxn({
    from,
    to,
    assetName,
    assetURL,
    note,
    amount,
    unitName,
    decimals,
    total,
    assetMetadata,
    ...extras
  });
}

// /**
//  * This function attempts to create a universal function that will opt-in to an assets. This 
//  * uses the chain driver, so it is chain specific. Note that some chains like Ethereum don't have this 
//  * requirement of opting in, so this may be left blank for some blockchains. This generates an unsigned 
//  * asset opt-in transaction, and this is to be signed and broadcasted to the blockchain network. Note this may 
//  * need an API key defined in your chain driver depending on your chain driver implementation.
//  * @param optInAssetParams - JSON object specifying universal asset opt-in fields like assetIndex and the 
//  * 'to' address
//  * @returns If successful, will return a UniversalTxn object that specifies the bytes to sign and submit
//  * to create a valid asset opt-in transaction. Throws upon error.
//  */
// export async function createAssetOptInTxn(optInAssetParams: CreateOptInAssetParams): Promise<UniversalTxn> {
//     const {
//         to,
//         from = to,
//         assetIndex,
//         extras = undefined
//     } = optInAssetParams

//     return await chainDriver.makeAssetOptInTxn({
//         to,
//         from,
//         assetIndex,
//         ...extras
//     });
// }

/**
 * This function attempts to create a universal function that will transfer an asset. This 
 * uses the chain driver, so it is chain specific. Note that the asset must be transferable for this to work.
 * This generates an unsigned asset transfer transaction, and this is to be signed and broadcasted to 
 * the blockchain network. Note this may need an API key defined in your chain driver depending on your 
 * chain driver implementation.
 * @param transferAssetParams - JSON object specifying universal asset transfer fields such as the assetIndex 
 * and the 'to' address
 * @returns If successful, will return a UniversalTxn object that specifies the bytes to sign and submit
 * to create a valid asset transfer transaction. Throws upon error.
 */
export async function createAssetTransferTxn(transferAssetParams: CreateTransferAssetParams): Promise<UniversalTxn> {
  const {
    to,
    from,
    assetIndex,
    extras = undefined
  } = transferAssetParams

  return await chainDriver.makeAssetTransferTxn({
    to,
    from,
    assetIndex,
    ...extras
  });
}

/**
 * Sends a signed transaction to the network. Specific to the specified chain driver. Note this may 
 * need an API key defined in your chain driver depending on your chain driver implementation.
 * @param signedTxnBytes - Uint8Array of the signed transaction bytes.
 * @param txnId - Transaction ID string
 * @returns Throws on error. If successful, will not throw. May return any metadata depending on chain
 * driver implementation.
 */
export async function sendTxn(signedTxnBytes: Uint8Array | Uint8Array[], txnId: string) {
  return await chainDriver.sendTxn(signedTxnBytes, txnId)
}

// export async function createContractOptInTxn(contractOptInParams: CreateContractOptInParams) {
//     const {
//         from,
//         appIndex,
//         extras = undefined
//     } = contractOptInParams

//     return await chainDriver.makeContractOptInTxn({
//         from,
//         appIndex,
//         ...extras
//     })
// }

// export async function createContractNoOpTxn(contractNoOpParams: CreateContractNoOpParams) {
//     const {
//         from,
//         appIndex,
//         appArgs,
//         accounts,
//         foreignAssets
//     } = contractNoOpParams

//     return await chainDriver.makeContractNoOpTxn({
//         from,
//         appIndex,
//         appArgs,
//         accounts,
//         foreignAssets
//     })
// }

// export async function lookupApplicationLocalState(address: string) {
//     return await chainDriver.lookupApplicationLocalState(address);
// }
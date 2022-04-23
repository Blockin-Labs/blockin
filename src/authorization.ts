import algosdk from 'algosdk';
import { getClient, getWallet } from './blockin';
import { IClient } from './types';

try {
  var client: IClient = getClient()
  var wallet: any = getWallet()
}
catch (e: any) {
  console.log(e)
}


/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @param receiverAddress 
 * @param assetId 
 * @returns an unsigned asset opt-in transaction
 */
export async function makeAssetOptInTxn(
  from: string,
  to: string,
  closeRemainderTo: string | undefined,
  revocationTarget: string | undefined,
  amount: number | bigint,
  note: Uint8Array | undefined,
  assetIndex: number,
  rekeyTo?: string | undefined
) {

  // Create opt-in transaction (note that sender and receiver addresses are the same)
  return client.makeAssetTransferTxn(
    from,
    to,
    closeRemainderTo,
    revocationTarget,
    amount,
    note,
    assetIndex,
    rekeyTo
  );
}

/**
 * Generates an unsigned asset creation transaction, to be signed and sent to the algorand network
 * @param senderAddress 
 * @param assetName 
 * @param unitName 
 * @param total 
 * @param assetURL 
 * @param assetMetadataHash 
 * @param defaultFrozen 
 * @param clawbackAddr 
 * @returns an unsigned asset creation transaction
 */
export async function makeAssetCreateTxn(from: string, assetName: string, unitName: string, total: number, assetURL: string, assetMetadataHash: string | Uint8Array, defaultFrozen = false, clawback = from): Promise<algosdk.Transaction> {
  const decimals = 0
  return await client.createTxn({
    from,
    total,
    decimals,
    assetName,
    unitName,
    assetURL,
    assetMetadataHash,
    defaultFrozen,
    freeze: from,
    manager: from,
    clawback,
    reserve: from
  });
}

// export async function sendTx(stxs: Uint8Array | Uint8Array[]) {
//   const sentTx = await client.sendTx(stxs)
//   console.log("Transaction : " + sentTx.txId);
//   console.log("Asset ID: " + "lookup asset id")
//   return sentTx
// }

// async function txIdToAssetId(txId: string): Promise<string> {
//   return client.getAssetIndex(txId)
// }

// //get the tx signed, most likely using bound function
// //Generate an opt in tx
// // Sign transaction
// // txns is an array of algosdk.Transaction like below
// // i.e txns = [txn, ...someotherTxns], but we've only built one transaction in our case
// export async function createRequestParams(): Promise<any> {
//   const txns = [await makeAssetOptInTxn(optInParams)]
//   return txns.map(txn => {
//     return {
//         txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64"),
//         message: 'Description of transaction being signed',
//         // Note: if the transaction does not need to be signed (because it's part of an atomic group
//         // that will be signed by another party), specify an empty singers array like so:
//         // signers: [],
//     };
//   });
// }

// async function createAssetCreateTxn(senderAddress: string, assetMetadataHash: string) {
//   const txns = [await makeAssetCreateTxn(senderAddress, "Blockin", "AUTH", 1, "blockin", assetMetadataHash)]
//   return txns
// }


// /**
//  * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
//  * @param senderAddress 
//  * @param receiverAddress 
//  * @param assetId 
//  * @returns an unsigned asset transfer transaction
//  */
// async function makeAssetTransferTxn(senderAddress: string, receiverAddress: string, assetId: number): Promise<algosdk.Transaction> {
//   const amount = 1;
//   const closeRemainderTo = undefined;
//   const revocationTarget = undefined;
//   const note = undefined;

//   // Create asset transfer transaction
//   return client.makeAssetTransferTxnWithSuggestedParams(
//     senderAddress,
//     receiverAddress,
//     closeRemainderTo,
//     revocationTarget,
//     amount,
//     note,
//     assetId
//   );
// }
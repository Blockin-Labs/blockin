// This file handles creating, opting in to, and transfering an auth asset from resource to owner
import { getClient } from "./blockin";
import { CreateAssetParamsType, IClient, TransferAssetParamsType } from "./types";

try {
    var client: IClient = getClient()
}
catch (e: any) {
    console.log(e)
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
export async function createTxn(assetParams: CreateAssetParamsType): Promise<any> {
    // const decimals = 0
    return await client.createTxn({
        to: assetParams.to, 
        assetName: assetParams.assetName, 
        assetURL: assetParams.assetURL, 
        unitName: assetParams.unitName, 
        decimals: assetParams.decimals,
        total: assetParams.total, 
        assetMetadataHash: assetParams.assetMetadataHash
    });
}

/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @param receiverAddress 
 * @param assetId 
 * @returns an unsigned asset opt-in transaction
 */
export async function createOptInTxn(to: string, assetIndex: number): Promise<any> {
    // Create opt-in transaction (note that sender and receiver addresses are the same)
    return await client.makeAssetOptInTxn({
        to,
        assetIndex,
    });
}

export async function sendTx(stxs: Uint8Array | Uint8Array[]) {
    return await client.sendTx(stxs)
}

/**
 * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
 * @param senderAddress 
 * @param receiverAddress 
 * @param assetId 
 * @returns an unsigned asset transfer transaction
 */
export async function makeAssetTransferTxn(assetParams: TransferAssetParamsType): Promise<any> {
    // const amount = 1;
    // const closeRemainderTo = undefined;
    // const revocationTarget = undefined;
    // const note = undefined;

    // Create asset transfer transaction
    return await client.makeAssetTransferTxn({
        to: assetParams.to,
        from: assetParams.from,
        closeRemainderTo: assetParams.closeRemainderTo,
        revocationTarget: assetParams.revocationTarget,
        amount: assetParams.amount,
        note: assetParams.note,
        assetIndex: assetParams.assetIndex,
        ...assetParams.extras
    });
}


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
import algosdk from 'algosdk';
import { sha256 } from '.';

const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
const indexerServer = "https://testnet-algorand.api.purestake.io/idx2";

const port = "";
const token = {
  "x-api-key": "H4sefDbnoL8GO8ooRkxQM6CePHih5XDQ405mcBKy" // fill in yours
};

/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @param receiverAddress 
 * @param assetId 
 * @returns an unsigned asset opt-in transaction
 */
export async function makeAssetOptInTxn(receiverAddress: string, assetId: number): Promise<algosdk.Transaction> {
  const algodClient = new algosdk.Algodv2(token, algodServer, port);

  const amount = 0;
  const params = await algodClient.getTransactionParams().do();
  const closeRemainderTo = undefined;
  const revocationTarget = undefined;
  const note = undefined;

  // Create opt-in transaction (note that sender and receiver addresses are the same)
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    receiverAddress,
    receiverAddress,
    closeRemainderTo,
    revocationTarget,
    amount,
    note,
    assetId,
    params
  );

  return txn;
}

export async function signAssetOptInTxn(receiverAddress: string, assetId: number, sign: (txns: algosdk.Transaction | algosdk.Transaction[]) => Uint8Array | Uint8Array[]) {
  const algodClient = new algosdk.Algodv2(token, algodServer, port);

  const txns = [await makeAssetOptInTxn(receiverAddress, assetId)]

  //get the tx signed, most likely using bound function
  const stxs: Uint8Array | Uint8Array[] = await sign(txns)

  const sentTx = await algodClient.sendRawTransaction(stxs).do();

  console.log("Transaction : " + sentTx.txId);
  console.log("Asset ID: " + "lookup asset id")
}

/**
 * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
 * @param senderAddress 
 * @param receiverAddress 
 * @param assetId 
 * @returns an unsigned asset transfer transaction
 */
export async function makeAssetTransferTxn(senderAddress: string, receiverAddress: string, assetId: number): Promise<algosdk.Transaction> {
  const algodClient = new algosdk.Algodv2(token, algodServer, port);

  const amount = 1;
  const params = await algodClient.getTransactionParams().do();
  const closeRemainderTo = undefined;
  const revocationTarget = undefined;
  const note = undefined;

  // Create asset transfer transaction
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    senderAddress,
    receiverAddress,
    closeRemainderTo,
    revocationTarget,
    amount,
    note,
    assetId,
    params
  );

  return txn
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
export async function makeAssetCreateTxn(senderAddress: string, assetName: string, unitName: string, total: number, assetURL: string, assetMetadataHash: string | Uint8Array, defaultFrozen = false, clawbackAddr = senderAddress): Promise<algosdk.Transaction> {
  const algodClient = new algosdk.Algodv2(token, algodServer, port);

  const decimals = 0

  const suggestedParams = await algodClient.getTransactionParams().do()
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: senderAddress,

    total,
    decimals,

    assetName,
    unitName,
    assetURL,
    assetMetadataHash,
    defaultFrozen,

    freeze: senderAddress,
    manager: senderAddress,
    clawback: clawbackAddr,
    reserve: senderAddress,

    suggestedParams,
  });

  return txn
}

export async function txIdToAssetId(txId: string): Promise<string> {
  const indexerClient = new algosdk.Indexer(token, indexerServer, port);
  const foundTx = await indexerClient.lookupTransactionByID(txId).do();
  return foundTx.assetIndex
}

export async function signAssetCreateTxn(senderAddress: string, assetMetadataHash: string, sign: (txns: algosdk.Transaction | algosdk.Transaction[]) => Uint8Array | Uint8Array[]) {
  const algodClient = new algosdk.Algodv2(token, algodServer, port);

  const txns = [await makeAssetCreateTxn(senderAddress, "Blockin", "AUTH", 1, "blockin", assetMetadataHash)]

  //get the tx signed, most likely using bound function
  const stxs: Uint8Array | Uint8Array[] = await sign(txns)

  const sentTx = await algodClient.sendRawTransaction(stxs).do();

  console.log("Transaction : " + sentTx.txId);
  console.log("Asset ID: " + "lookup asset id")
}
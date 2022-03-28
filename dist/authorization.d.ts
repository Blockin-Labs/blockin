import algosdk from 'algosdk';
/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @param receiverAddress
 * @param assetId
 * @returns an unsigned asset opt-in transaction
 */
export declare function makeAssetOptInTxn(receiverAddress: string, assetId: number): Promise<algosdk.Transaction>;
/**
 * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
 * @param senderAddress
 * @param receiverAddress
 * @param assetId
 * @returns an unsigned asset transfer transaction
 */
export declare function makeAssetTransferTxn(senderAddress: string, receiverAddress: string, assetId: number): Promise<algosdk.Transaction>;
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
export declare function makeAssetCreateTxn(senderAddress: string, assetName: string, unitName: string, total: number, assetURL: string, assetMetadataHash: string, defaultFrozen?: boolean, clawbackAddr?: string): Promise<algosdk.Transaction>;

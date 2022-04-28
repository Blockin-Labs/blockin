// This file handles creating, opting in to, and transfering an auth asset from resource to owner
import { getClient } from "./blockin";
import { IClient, CreateAssetParams, OptInAssetParams, TransferAssetParams } from "./types";

try {
    var client: IClient = getClient()
}
catch (e: any) {
    console.log(e)
}

/**
 * Generates an unsigned asset creation transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset creation transaction
 */
export async function createAssetTxn(createAssetParams: CreateAssetParams): Promise<any> {
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
        assetMetadataHash = '',
        extras = undefined
    } = createAssetParams

    return await client.makeAssetTxn({
        from,
        to, 
        assetName,
        assetURL,
        note,
        amount,
        unitName, 
        decimals,
        total, 
        assetMetadataHash,
        ...extras
    });
}

/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset opt-in transaction
 */
export async function createAssetOptInTxn(optInAssetParams: OptInAssetParams): Promise<any> {
    const {
        to,
        from = to,
        assetIndex,
        extras = undefined
    } = optInAssetParams

    return await client.makeAssetOptInTxn({
        to,
        from,
        assetIndex,
        ...extras
    });
}

/**
 * Generates an unsigned asset transfer transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset transfer transaction
 */
 export async function createAssetTransferTxn(transferAssetParams: TransferAssetParams): Promise<any> {
    const {
        to,
        from,
        amount = 1,
        note = 'Transfer this asset',
        assetIndex,
        extras = undefined
    } = transferAssetParams
    
    return await client.makeAssetTransferTxn({
        to,
        from,
        amount,
        note,
        assetIndex,
        ...extras
    });
}

export async function sendAssetTxn(stxs: Uint8Array | Uint8Array[]) {
    return await client.sendTxn(stxs)
}

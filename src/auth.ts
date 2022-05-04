// This file handles creating, opting in to, and transfering an auth asset from resource to owner
import { IChainDriver, UniversalTxn } from './@types/ChainDriver'
import { CreateAssetParams, CreateOptInAssetParams, CreateTransferAssetParams } from "./@types/auth";

var chainDriver: IChainDriver

export function initializeAuth(driver: IChainDriver) {
    chainDriver = driver
}

/**
 * Generates an unsigned asset creation transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset creation transaction
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

/**
 * Generates an unsigned asset opt-in transaction, to be signed and sent to the algorand network
 * @returns an unsigned asset opt-in transaction
 */
export async function createAssetOptInTxn(optInAssetParams: CreateOptInAssetParams): Promise<UniversalTxn> {
    const {
        to,
        from = to,
        assetIndex,
        extras = undefined
    } = optInAssetParams

    return await chainDriver.makeAssetOptInTxn({
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

export async function sendTxn(stx: Uint8Array | Uint8Array[], txnId: string) {
    return await chainDriver.sendTxn(stx, txnId)
}

var chainDriver;
export function initializeAuth(driver) {
    chainDriver = driver;
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
export async function createAssetTxn(createAssetParams) {
    const { from, to = 'Blockin', assetName = 'Blockin Access Token', assetURL = '', note = 'This is an access token created with Blockin', amount = 1, unitName = '', decimals = 0, total = 1, assetMetadata = '', extras = undefined } = createAssetParams;
    return await chainDriver.makeAssetTxn(Object.assign({ from,
        to,
        assetName,
        assetURL,
        note,
        amount,
        unitName,
        decimals,
        total,
        assetMetadata }, extras));
}
/**
 * This function attempts to create a universal function that will opt-in to an assets. This
 * uses the chain driver, so it is chain specific. Note that some chains like Ethereum don't have this
 * requirement of opting in, so this may be left blank for some blockchains. This generates an unsigned
 * asset opt-in transaction, and this is to be signed and broadcasted to the blockchain network. Note this may
 * need an API key defined in your chain driver depending on your chain driver implementation.
 * @param optInAssetParams - JSON object specifying universal asset opt-in fields like assetIndex and the
 * 'to' address
 * @returns If successful, will return a UniversalTxn object that specifies the bytes to sign and submit
 * to create a valid asset opt-in transaction. Throws upon error.
 */
export async function createAssetOptInTxn(optInAssetParams) {
    const { to, from = to, assetIndex, extras = undefined } = optInAssetParams;
    return await chainDriver.makeAssetOptInTxn(Object.assign({ to,
        from,
        assetIndex }, extras));
}
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
export async function createAssetTransferTxn(transferAssetParams) {
    const { to, from, assetIndex, extras = undefined } = transferAssetParams;
    return await chainDriver.makeAssetTransferTxn(Object.assign({ to,
        from,
        assetIndex }, extras));
}
/**
 * Sends a signed transaction to the network. Specific to the specified chain driver. Note this may
 * need an API key defined in your chain driver depending on your chain driver implementation.
 * @param signedTxnBytes - Uint8Array of the signed transaction bytes.
 * @param txnId - Transaction ID string
 * @returns Throws on error. If successful, will not throw. May return any metadata depending on chain
 * driver implementation.
 */
export async function sendTxn(signedTxnBytes, txnId) {
    return await chainDriver.sendTxn(signedTxnBytes, txnId);
}

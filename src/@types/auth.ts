
export type CreateAssetParams = {
    from: string,
    to?: string, 
    assetName?: string, 
    assetURL?: string, 
    note?: string,
    amount?: number,
    unitName?: string, 
    decimals?: number,
    total?: number, 
    assetMetadata?: string | Uint8Array, 
    extras?: any
}

export type CreateOptInAssetParams = {
    to: string, 
    from?: string,
    assetIndex: number,
    extras?: any
}

export type CreateTransferAssetParams = {
    to: string,
    from: string,
    amount?: number | bigint,
    note?: Uint8Array | undefined,
    assetIndex: number,
    extras?: any
}

export type CreatePaymentParams = {
    to: string, 
    from?: string,
    amount?: number | bigint,
    note?: string,
    extras?: any
}

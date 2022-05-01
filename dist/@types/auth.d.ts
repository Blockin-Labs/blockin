export declare type CreateAssetParams = {
    from: string;
    to?: string;
    assetName?: string;
    assetURL?: string;
    note?: string;
    amount?: number;
    unitName?: string;
    decimals?: number;
    total?: number;
    assetMetadata?: string;
    extras?: any;
};
export declare type CreateOptInAssetParams = {
    to: string;
    from?: string;
    amount?: number | bigint;
    assetIndex: number;
    extras?: any;
};
export declare type CreateTransferAssetParams = {
    to: string;
    from: string;
    amount?: number | bigint;
    note?: Uint8Array | undefined;
    assetIndex: number;
    extras?: any;
};
export declare type CreatePaymentParams = {
    to: string;
    from?: string;
    amount?: number | bigint;
    note?: string;
    extras?: any;
};

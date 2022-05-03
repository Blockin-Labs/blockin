import { IChainDriver } from "./@types/ChainDriver";
export declare function setChainDriver(driver: IChainDriver): void;
export declare function sha256(message: string): Promise<Uint8Array>;

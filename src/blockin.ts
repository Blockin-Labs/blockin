import { IChainDriver } from "./@types/ChainDriver";
import { initializeAuth } from "./auth";
import { initializeVerify } from "./verify";

export function setChainDriver(driver: IChainDriver) {
    initializeVerify(driver)
    initializeAuth(driver)
}


import { initializeAuth } from "./auth";
import { initializeVerify } from "./verify";
export function setChainDriver(driver) {
    initializeVerify(driver);
    initializeAuth(driver);
}

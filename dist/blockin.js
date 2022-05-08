import { initializeAuth } from "./auth";
import { initializeVerify } from "./verify";
/**
 * Sets the chain driver for the whole library. All chain-specific functions
 * depend on a valid chain driver being set, so it is important that you call
 * this function before doing anything. We export some already implemented ChainDriver
 * classes from this library for your convenience. You may also choose to implement
 * your own.
 *
 * For example in Blockin's sample demo site, we call setDriver(new AlgoDriver('Mainnet', API_KEY)), and
 * once this is called, all other functions will use the implemented functions for Algorand defined
 * in AlgoDriver
 * @param driver - Instantiated ChainDriver object. See IChainDriver for the interface details
 */
export function setChainDriver(driver) {
    initializeVerify(driver);
    initializeAuth(driver);
}

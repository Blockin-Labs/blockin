import { initializeAuth } from "./auth";
import { initializeVerify } from "./verify";
export function setChainDriver(driver) {
    initializeVerify(driver);
    initializeAuth(driver);
}
export async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = new Uint8Array(hashBuffer);
    return hashArray;
}

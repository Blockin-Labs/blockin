// Changes: Dont repeate hashing code, instead do it in sha256 and call from sha256AsString
// Also, immediately return instead of storing as variable before returning?
// Also, are we even using sha256AsString method??

import { Interface } from "readline";
import { IClient } from "./types";

/**
 * Encodes a string message as UTF-8 and converts to SHA256 hash as an ArrayBuffer.
 * Then converts ArrayBuffer to an Array
 * @param message The string to covert
 * @returns SHA256 hash of message, as an array
 */
export async function sha256(message: string): Promise<Uint8Array> {
    const msgBuffer = new TextEncoder().encode(message);    // encode as UTF-8               
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);    // hash the message
    return new Uint8Array(hashBuffer);   // Convert ArrayBuffer to Array
}

// /**
//  * Converts a string message into a SHA256 hash array
//  * @param message The string to covert
//  * @returns SHA256 hash of message, as an array
//  */
// export async function sha256AsString(message: string): Promise<string> {
//     const hashArray = Array.from(await sha256(message)); // Call sha256AsArray to get hash array iterable and convert to array
//     return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');   // convert bytes to hex string 
// }

let client: IClient | undefined = undefined

export function setClient(newClient: IClient) {
    client = newClient
}

export function getClient(): IClient {
    if (!client) {
        throw "ERROR: Client is undefied"
    }
    return client
}
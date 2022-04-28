import { IClient } from "./@types/Client";
import { initializeAuth } from "./auth";
import { initializeVerify } from "./verify";

let client: IClient | undefined = undefined

export function setClient(client: IClient) {
    client = client
    initializeVerify(client)
    initializeAuth(client)
}

export function getClient() {
    if (!client) {
        throw "ERROR: Client is undefined"
    }
    return client
}

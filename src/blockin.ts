import { IClient } from "./types";

let client: IClient | undefined = undefined

export function setClient(client: IClient) {
    client = client
}

export function getClient() {
    if (!client) {
        throw "ERROR: Client is undefined"
    }
    return client
}

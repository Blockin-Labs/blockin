import { IClient } from "./@types/Client";

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

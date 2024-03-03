import { nanoid } from 'nanoid';
import { cosmosDataContainerLoginRequests } from '../cosmosClient';

export async function loginRequestsCreate(email: string) {
    const id = `loginrequest_${nanoid()}`;
    const loginRequest = {
        id: id,
        email,
        createdAt: Date.now() / 1000, // UNIX seconds timestamp
    };

    // TODO: Add ttl to automatically delete stale requests

    const dbLoginRequests = cosmosDataContainerLoginRequests();
    await dbLoginRequests.items.create(loginRequest);
    return id;
}

export async function loginRequestsVerify(email: string, id: string) {
    const dbLoginRequests = cosmosDataContainerLoginRequests();
    const { resource: loginRequest } = await dbLoginRequests.item(id, id).read();

    // TODO: Add metric for logins/failed attampts

    if (loginRequest?.email !== email)
        return false;

    await dbLoginRequests.item(id, id).delete();

    return true;
}
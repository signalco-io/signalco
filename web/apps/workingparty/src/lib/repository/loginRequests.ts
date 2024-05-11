import { nanoid } from 'nanoid';
import { cosmosDataContainerLoginRequests } from '../cosmosClient';

type DbLoginRequest = {
    id: string;
    email: string;
    clientId: string;
    createdAt: number;
    verifiedAt?: number;
};

export async function loginRequestsCreate(email: string) {
    const id = `loginrequest_${nanoid()}`;
    const clientId = `loginclient_${nanoid()}`;
    const loginRequest = {
        id: id,
        email,
        clientId,
        createdAt: Date.now() / 1000, // UNIX seconds timestamp
    };

    // TODO: Add ttl to automatically delete stale requests

    const dbLoginRequests = cosmosDataContainerLoginRequests();
    await dbLoginRequests.items.create<DbLoginRequest>(loginRequest);
    return {
        id,
        clientId
    };
}

export async function loginRequestsVerify(id: string) {
    const dbLoginRequests = cosmosDataContainerLoginRequests();
    const { resource: loginRequest } = await dbLoginRequests.item(id, id).read<DbLoginRequest>();
    if (!loginRequest)
        return false;

    // Check if already verified
    if (loginRequest.verifiedAt) {
        throw new Error('Login request already verified');
    }

    // TODO: Add metric for logins/failed attampts
    // TODO: Request expiry

    console.info('Login verified', id);
    await dbLoginRequests.item(id, id).patch<DbLoginRequest>({
        operations: [
            { op: 'add', path: '/verifiedAt', value: Date.now() / 1000 },
        ]
    });

    return true;
}

export async function loginRequestsUse(clientId: string) {
    const dbLoginRequests = cosmosDataContainerLoginRequests();
    const requests = await dbLoginRequests.items.query<DbLoginRequest>({
        query: 'SELECT * FROM c WHERE c.clientId = @clientId AND IS_DEFINED(c.verifiedAt)',
        parameters: [{ name: '@clientId', value: clientId }]
    }).fetchAll();

    const request = requests.resources[0];
    if (!request)
        return null;

    // TODO: Verify request expiry

    console.log('Login used', request.id);
    await dbLoginRequests.item(request.id, request.id).delete();
    return request.email;
}
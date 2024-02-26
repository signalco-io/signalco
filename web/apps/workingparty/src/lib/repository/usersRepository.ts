import { nanoid } from 'nanoid';
import { cosmosDataContainerEmailUser, cosmosDataContainerUsers } from '../cosmosClient';

export type DbUser = {
    id: string;
    displayName: string;
    email: string;
    accountIds: Array<string>;
    createdAt: number;
};

export type UserCreate = {
    email: string;
};

export async function usersGet(id: string): Promise<DbUser> {
    const dbUsers = cosmosDataContainerUsers();
    const { resource: userDbItem } = await dbUsers.item(id, id).read();

    return {
        id: userDbItem.id,
        displayName: userDbItem.displayName,
        email: userDbItem.email,
        accountIds: userDbItem.accountIds,
        createdAt: userDbItem.createdAt,
    };
}

export async function usersGetByEmail(email: string): Promise<string | null> {
    const dbEmailUser = cosmosDataContainerEmailUser();
    const { resources } = await dbEmailUser.items.readAll({ partitionKey: email }).fetchAll();
    return resources[0]?.userId;
}

export async function usersCreate({
    email
}: UserCreate) {
    const userId = nanoid();
    const user: DbUser = {
        id: userId,
        displayName: email,
        email,
        accountIds: [],
        createdAt: Date.now() / 1000, // UNIX timestamp
    };

    await cosmosDataContainerUsers().items.create(user);
    await cosmosDataContainerEmailUser().items.create({ email, userId });

    return userId;
}

export async function usersAssignAccount(userId: string, accountId: string) {
    const dbUsers = cosmosDataContainerUsers();
    await dbUsers.item(userId, userId).patch({
        operations: [
            { op: 'add', path: '/accountIds/-', value: accountId }
        ]
    });
}

import { nanoid } from 'nanoid';
import { cosmosDataContainerAccounts } from '../cosmosClient';

export type DbAccount = {
    id: string;
    name: string;
    createdAt: number;
};

export type AccountCreate = {
    name: string;
};

export async function accountGet(id: string): Promise<DbAccount> {
    const dbAccounts = cosmosDataContainerAccounts();
    const { resource: accountDbItem } = await dbAccounts.item(id, id).read();

    return {
        id: accountDbItem.id,
        name: accountDbItem.name,
        createdAt: accountDbItem.createdAt,
    };
}

export async function accountCreate({
    name
}: AccountCreate) {
    const accountId = nanoid(8);
    const account: DbAccount = {
        id: accountId,
        name,
        createdAt: Date.now() / 1000, // UNIX timestamp
    };

    const dbAccounts = cosmosDataContainerAccounts();
    await dbAccounts.items.create(account);

    return accountId;
}
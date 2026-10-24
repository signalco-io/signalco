import { nanoid } from 'nanoid';
import { cosmosDataContainerWorkers } from '../cosmosClient';
import { marketplaceWorkers } from '../../data/markerplaceWorkers';

export type DbWorker = {
    id: string;
    accountId: string;
    name: string;
    marketplaceWorkerId?: string;
    model: string;
    instructions: string;
    isCustom: boolean;
    createdAt: number;
};

export type DbWorkerSimple = {
    id: string;
    name: string;
};

export async function workersGetAll(accountId: string): Promise<Array<DbWorkerSimple>> {
    const dbWorkers = cosmosDataContainerWorkers();
    const allWorkers = await dbWorkers.items.readAll({ partitionKey: accountId }).fetchAll();

    const workersData = allWorkers.resources.map((workerDbItem) => {
        if (!workerDbItem.id)
            return null;

        return ({
            id: workerDbItem.id,
            name: workerDbItem.name ?? '',
        });
    }).filter(Boolean) ?? [];

    return workersData;
}

export async function workersGet(accountId: string, workerId: string): Promise<DbWorker> {
    const dbWorkers = cosmosDataContainerWorkers();
    const { resource: workerDbItem } = await dbWorkers.item(workerId, accountId).read();

    // Fallback for legacy records that stored assistant id only
    const marketplaceInfo = marketplaceWorkers.find((w) => w.id === workerDbItem.marketplaceWorkerId);

    return {
        id: workerDbItem.id,
        accountId: workerDbItem.accountId,
        name: workerDbItem.name,
        marketplaceWorkerId: workerDbItem.marketplaceWorkerId,
        model: workerDbItem.model ?? marketplaceInfo?.model ?? 'gpt-4o',
        instructions: workerDbItem.instructions ?? ('You are a worker for Working Party. You are an expert in your field.' + (marketplaceInfo?.instructions ?? '')),
        isCustom: workerDbItem.isCustom ?? false,
        createdAt: workerDbItem.createdAt,
    };
}

export async function workersCreate({ accountId, marketplaceWorkerId }: { accountId: string, marketplaceWorkerId?: string }) {
    const wid = nanoid(8);

    // TODO: Custom assistants only in PRO plan (in future)
    const isCustom = false;

    // Retrieve marketplace worker info
    const workerMarketplaceInfo = marketplaceWorkers.find((worker) => worker.id === marketplaceWorkerId);
    if (!workerMarketplaceInfo)
        throw new Error('Invalid marketplaceWorkerId');

    const assistantMarketplaceInstructions = 'You are a worker for Working Party. You are an expert in your field.' + workerMarketplaceInfo.instructions;

    const newWorker: DbWorker = {
        id: wid,
        accountId: accountId,
        name: workerMarketplaceInfo.name,
        marketplaceWorkerId: workerMarketplaceInfo.id,
        model: workerMarketplaceInfo.model,
        instructions: assistantMarketplaceInstructions,
        isCustom: isCustom,
        createdAt: new Date().getTime() / 1000, // UNIX seconds timestamp
    };

    const dbWorkers = cosmosDataContainerWorkers();
    await dbWorkers.items.create(newWorker);

    return newWorker.id;
}

export async function workersDelete(accountId: string, workerId: string) {
    const dbWorkers = cosmosDataContainerWorkers();
    // TODO: Removed from all assigned threads
    await dbWorkers.item(workerId, accountId).delete();
}

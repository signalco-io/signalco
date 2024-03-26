import { nanoid } from 'nanoid';
import { openAiClient } from '../openAiClient';
import { cosmosDataContainerWorkers } from '../cosmosClient';
import { marketplaceWorkers } from '../../data/markerplaceWorkers';

export type DbWorker = {
    id: string;
    accountId: string;
    name: string;
    marketplaceWorkerId?: string;
    oaiAssistantId: string;
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

    return {
        id: workerDbItem.id,
        accountId: workerDbItem.accountId,
        name: workerDbItem.name,
        marketplaceWorkerId: workerDbItem.marketplaceWorkerId,
        oaiAssistantId: workerDbItem.oaiAssistantId,
        isCustom: workerDbItem.isCustom ?? false,
        createdAt: workerDbItem.createdAt,
    };
}

export async function workersCreate({ accountId, marketplaceWorkerId }: { accountId: string, marketplaceWorkerId?: string }) {
    const wid = nanoid(8);

    // TODO: Custom assistants only in PRO plan
    const isCustom = false;

    // Retrieve marketplace worker info
    const workerMarketplaceInfo = marketplaceWorkers.find((worker) => worker.id === marketplaceWorkerId);
    if (!workerMarketplaceInfo)
        throw new Error('Invalid marketplaceWorkerId');

    // Find assistant in OpenAI if exists,
    // otherwise create a new one
    const openai = openAiClient();
    const assistants = await openai.beta.assistants.list();
    let oaiAssistant = assistants.data.find((assistant) => assistant.name === `WPMarketplace-${workerMarketplaceInfo.id}`);
    if (!oaiAssistant) {
        oaiAssistant = await openai.beta.assistants.create({
            model: 'gpt-3.5-turbo',
            name: `WPMarketplace-${workerMarketplaceInfo.id}`,
            description: `Working Party Assistant - Marketplace Model ${workerMarketplaceInfo.id}`,
            instructions: 'You are a worker for Working Party. You will be assigned to threads and help with tasks. ' + workerMarketplaceInfo.description,
        });
    }

    const newWorker: DbWorker = {
        id: wid,
        accountId: accountId,
        name: workerMarketplaceInfo.name,
        marketplaceWorkerId: workerMarketplaceInfo.id,
        oaiAssistantId: oaiAssistant.id,
        isCustom: isCustom,
        createdAt: new Date().getTime() / 1000, // UNIX seconds timestamp
    };

    const dbWorkers = cosmosDataContainerWorkers();
    await dbWorkers.items.create(newWorker);

    return newWorker.id;
}

export async function workersDelete(accountId: string, workerId: string) {
    const dbWorkers = cosmosDataContainerWorkers();
    const worker = await workersGet(accountId, workerId);

    // TODO: Removed from all assigned threads

    await dbWorkers.item(workerId, accountId).delete();

    // Delete from OpenAI (only custom assistants, marketplace workers use shared assistant)
    if (worker.isCustom && worker.oaiAssistantId) {
        try {
            await openAiClient().beta.assistants.del(worker.oaiAssistantId);
        } catch (error) {
            console.error('Failed to delete OpenAI assistant', error);
        }
    }
}

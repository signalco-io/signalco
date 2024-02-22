import { nanoid } from 'nanoid';
import { openAiClient } from '../openAiClient';
import { cosmosDataContainerWorkers } from '../cosmosClient';
import { marketplaceWorkers } from '../../data/markerplaceWorkers';

export async function workersGetAll() {
    const dbWorkers = cosmosDataContainerWorkers();
    const allWorkers = await dbWorkers.items.readAll().fetchAll();

    const workersData = allWorkers.resources.map((workerDbItem) => ({
        id: workerDbItem.id,
        name: workerDbItem.name,
    })) ?? [];

    return workersData;
}

export async function workersGet(workerId: string) {
    const dbWorkers = cosmosDataContainerWorkers();
    const { resource: workerDbItem } = await dbWorkers.item(workerId, workerId).read();

    return {
        id: workerDbItem.id,
        name: workerDbItem.name,
        oaiAssistantId: workerDbItem.oaiAssistantId
    };
}

export async function workersCreate({ marketplaceWorkerId }: { marketplaceWorkerId?: string }) {
    const wid = nanoid(8);

    // TODO: Custom assistants only in PRO plan

    // Retrieve marketplace worker info
    const workerMarketplaceInfo = marketplaceWorkers.find((worker) => worker.id === marketplaceWorkerId);
    if (!workerMarketplaceInfo)
        throw new Error('Invalid marketplaceWorkerId');

    // Find assistant in OpenAI if exists,
    // otherwise create a new one
    const openai = openAiClient();
    const assistants = await openai.beta.assistants.list();
    let oaiAssistant = assistants.data.find((assistant) => assistant.name === `WPMarketplace-${wid}`);
    if (!oaiAssistant) {
        oaiAssistant = await openai.beta.assistants.create({
            model: 'gpt-3.5-turbo',
            name: `WPMarketplace-${wid}`,
            description: `Working Party Assistant - Marketplace Model ${wid}`,
            instructions: 'You are a worker for Working Party. You will be assigned to threads and help with tasks. ' + workerMarketplaceInfo.description,
        });
    }

    const newWorker = {
        id: wid,
        name: workerMarketplaceInfo.name,
        oaiAssistantId: oaiAssistant.id
    };

    const dbWorkers = cosmosDataContainerWorkers();
    await dbWorkers.items.create(newWorker);

    return newWorker.id;
}

export async function workersDelete(workerId: string) {
    const dbWorkers = cosmosDataContainerWorkers();
    const worker = await workersGet(workerId);

    // TODO: Removed from all assigned threads

    await dbWorkers.item(workerId, workerId).delete();

    // Delete from OpenAI
    await openAiClient().beta.assistants.del(worker.id);
}

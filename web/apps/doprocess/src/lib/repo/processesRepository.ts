import { nanoid } from 'nanoid';
import { lexinsert } from '@signalco/lexorder';
import { firstOrDefault } from '@signalco/js';
import { DbProcess, DbProcessRun, DbTask, DbTaskDefinition, TaskState } from '../db/schema';
import { cosmosDataContainerProcessRunTasks, cosmosDataContainerProcessRuns, cosmosDataContainerProcesses, cosmosDataContainerTaskDefinitions } from '../db/client';
import { entityIdByPublicId, entitySharedWithUser, publicIdNext } from './shared';

async function isProcessSharedWithUser(userId: string | null, processId: string) {
    const proc = await cosmosDataContainerProcesses().item(processId).read<DbProcess>();
    return proc.resource && entitySharedWithUser(userId, proc.resource);
}

export async function getTaskDefinitionIdByPublicId(processPublicId: string, taskDefinitionPublicId: string) {
    const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
    if (processId == null)
        return null;

    return firstOrDefault((await cosmosDataContainerTaskDefinitions().items.query({
        query: 'SELECT * FROM c WHERE c.processId = @processId AND c.publicId = @publicId',
        parameters: [
            { name: '@processId', value: processId },
            { name: '@publicId', value: taskDefinitionPublicId }]
    }).fetchAll()).resources)?.id;
}

export async function getProcessRunIdByPublicId(processPublicId: string, processRunPublicId: string) {
    const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
    if (processId == null)
        return null;

    return firstOrDefault((await cosmosDataContainerProcessRuns().items.query({
        query: 'SELECT * FROM c WHERE c.processId = @processId AND c.publicId = @publicId',
        parameters: [
            { name: '@processId', value: processId },
            { name: '@publicId', value: processRunPublicId }]
    }).fetchAll()).resources)?.id;
}

export async function getProcessRunTaskIdByPublicId(processPublicId: string, processRunPublicId: string, taskPublicId: string) {
    const processId = await entityIdByPublicId(cosmosDataContainerProcesses(), processPublicId);
    if (processId == null)
        return null;

    const processRunId = await getProcessRunIdByPublicId(processPublicId, processRunPublicId);
    if (processRunId == null)
        return null;

    return firstOrDefault((await cosmosDataContainerProcessRunTasks().items.query({
        query: 'SELECT * FROM c WHERE c.processId = @processId AND c.runId = @runId AND c.publicId = @publicId',
        parameters: [
            { name: '@processId', value: processId },
            { name: '@runId', value: processRunId },
            { name: '@publicId', value: taskPublicId }]
    }).fetchAll()).resources)?.id;
}

export async function getProcesses(userId: string) {
    return (await cosmosDataContainerProcesses().items.query<DbProcess>({
        query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(c.sharedWithUsers, @userId)',
        parameters: [{ name: '@userId', value: userId }]
    }).fetchAll()).resources;
}

export async function getProcess(userId: string | null, processId: string) {
    const proc = await cosmosDataContainerProcesses().item(processId).read<DbProcess>();
    return proc.resource && entitySharedWithUser(userId, proc.resource) ? proc.resource : undefined;
}

export async function createProcess(accountId: string, userId: string, name: string, basedOn?: string) {
    const container = cosmosDataContainerProcesses();
    const proccessId = `process_${nanoid()}`;
    await container.items.create<DbProcess>({
        id: proccessId,
        publicId: await publicIdNext(container),
        name: name,
        sharedWithUsers: [userId],
        createdBy: userId,
        createdAt: new Date(),
        accountId
    });

    // Copy task definitions to new process (if basedOn is provided)
    if (basedOn) {
        const basedOnId = await entityIdByPublicId(container, basedOn);
        if (basedOnId) {
            const basedOnProcess = await getProcess(userId, basedOnId);
            if (basedOnProcess) {
                const taskDefinitions = await getTaskDefinitions(userId, basedOnId);
                if (taskDefinitions.length) {
                    await Promise.all(taskDefinitions.map(async td => {
                        const taskDefinitionId = await createTaskDefinition(accountId, userId, proccessId, td.text ?? '');
                        if (td.type) {
                            await changeTaskDefinitionType(userId, proccessId, taskDefinitionId, td.type, td.typeData ?? '');
                        }
                    }));
                }
            }
        }
    }

    return proccessId;
}

export async function renameProcess(userId: string, processId: string, name: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    await cosmosDataContainerProcesses().item(processId).patch({
        operations: [
            { op: 'add', path: '/name', value: name },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function processShareWithUsers(userId: string, processId: string, sharedWithUsers: string[]) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    await cosmosDataContainerProcesses().item(processId).patch({
        operations: [
            { op: 'add', path: '/sharedWithUsers', value: sharedWithUsers },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function deleteProcess(userId: string, processId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions

    await deleteProcessTaskDefinitions(userId, processId);
    await cosmosDataContainerProcesses().item(processId).delete();
}

export async function getAllProcessesRuns(userId: string) {
    const processes = await getProcesses(userId);
    const processesIds = processes.map(p => p.id);
    if (!processesIds.length)
        return [];

    return (await cosmosDataContainerProcessRuns().items.query<DbProcessRun>({
        query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(@processesIds, c.processId) ORDER BY c.createdAt',
        parameters: [{ name: '@processesIds', value: processesIds }]
    }).fetchAll()).resources;
}

export async function getProcessRuns(userId: string, processId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    return (await cosmosDataContainerProcessRuns().items.query<DbProcessRun>({
        query: 'SELECT * FROM c WHERE c.processId = @processId ORDER BY c.createdAt',
        parameters: [{ name: '@processId', value: processId }]
    }).fetchAll()).resources;
}

export async function getProcessRun(userId: string | null, processId: string, runId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    const run = (await cosmosDataContainerProcessRuns().item(runId).read<DbProcessRun>()).resource;
    if (run?.processId !== processId)
        throw new Error('Not found');

    return run;
}

export async function runProcess(accountId: string, userId: string, processId: string, name: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    const container = cosmosDataContainerProcessRuns();
    const processRunId = `run_${nanoid()}`;
    await container.items.create<DbProcessRun>({
        id: processRunId,
        processId: processId,
        publicId: await publicIdNext(container, 6),
        state: 'running',
        name: name,
        createdBy: userId,
        createdAt: new Date(),
        accountId
    });
    return processRunId;
}

export async function renameProcessRun(userId: string, processId: string, runId: string, name: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    await cosmosDataContainerProcessRuns().item(runId).patch({
        operations: [
            { op: 'add', path: '/name', value: name },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function deleteProcessRun(userId: string, processId: string, runId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    // Delete tasks
    const tasks = await getTasks(userId, processId, runId);
    if (tasks.length) {
        // TODO: Handle large number of tasks (more than 100 - CosmosDB limit)
        await cosmosDataContainerProcessRunTasks().items.batch(
            tasks.map(task => ({ operationType: 'Delete', id: task.id })))
    }

    // Delete process run
    await cosmosDataContainerProcessRuns().item(runId).delete();
}

export async function getTaskDefinitions(userId: string | null, processId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    return (await cosmosDataContainerTaskDefinitions().items.query<DbTaskDefinition>({
        query: 'SELECT * FROM c WHERE c.processId = @processId ORDER BY c.order',
        parameters: [{ name: '@processId', value: processId }]
    }).fetchAll()).resources;
}

export async function getTaskDefinition(userId: string | null, processId: string, taskDefinitionId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    return firstOrDefault((await cosmosDataContainerTaskDefinitions().items.query<DbTaskDefinition>({
        query: 'SELECT * FROM c WHERE c.processId = @processId AND c.id = @id',
        parameters: [
            { name: '@processId', value: processId },
            { name: '@id', value: taskDefinitionId }]
    }).fetchAll()).resources);
}

async function getTaskDefinitionLastOrder(userId: string, processId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    const result = await cosmosDataContainerTaskDefinitions().items.query<string>({
        query: 'SELECT VALUE MAX(c.order) FROM c WHERE c.processId = @processId',
        parameters: [{ name: '@processId', value: processId }]
    }).fetchAll();

    return lexinsert(result.resources[0]);
}

export async function createTaskDefinition(accountId: string, userId: string, processId: string, text: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    const container = cosmosDataContainerTaskDefinitions();
    const taskDefinitionId = `task_${nanoid()}`;
    await container.items.create<DbTaskDefinition>({
        id: taskDefinitionId,
        processId: processId,
        publicId: await publicIdNext(container, 6),
        order: await getTaskDefinitionLastOrder(userId, processId),
        text: text,
        createdBy: userId,
        createdAt: new Date(),
        accountId
    });
    return taskDefinitionId;
}

export async function changeTaskDefinitionText(userId: string, processId: string, id: string, text: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    await cosmosDataContainerTaskDefinitions().item(id).patch({
        operations: [
            { op: 'add', path: '/text', value: text },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function changeTaskDefinitionType(userId: string, processId: string, id: string, type: string, typeData: string | null) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    await cosmosDataContainerTaskDefinitions().item(id).patch({
        operations: [
            { op: 'add', path: '/type', value: type },
            { op: 'add', path: '/typeData', value: typeData },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function changeTaskDefinitionOrder(userId: string, processId: string, id: string, order: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    await cosmosDataContainerTaskDefinitions().item(id).patch({
        operations: [
            { op: 'add', path: '/order', value: order },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function deleteTaskDefinition(userId: string, processId: string, id: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    await cosmosDataContainerTaskDefinitions().item(id).delete();
}

async function deleteProcessTaskDefinitions(userId: string, processId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions

    // Delete tasks based on task definition
    const taskDefinitions = await getTaskDefinitions(userId, processId);
    const taskDefinitionsIds = taskDefinitions.map(td => td.id);
    if (taskDefinitions.length) {
        const tasksContainer = cosmosDataContainerProcessRunTasks();
        const tasks = (await tasksContainer.items.query<DbTask>({
            query: 'SELECT * FROM c WHERE c.processId = @processId AND ARRAY_CONTAINS(@taskDefinitionsIds, c.taskDefinitionId)',
            parameters: [
                { name: '@processId', value: processId },
                { name: '@taskDefinitionsIds', value: taskDefinitionsIds }]
        }).fetchAll()).resources;
        if (tasks.length) {
            tasksContainer.items.bulk(
                tasks.map(task => ({ operationType: 'Delete', id: task.id })));
        }
    }

    // Delete task definitions
    await cosmosDataContainerTaskDefinitions().items.bulk(
        taskDefinitions.map(td => ({ operationType: 'Delete', id: td.id })));
}

export async function getTasks(userId: string | null, processId: string, runId: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    return (await cosmosDataContainerProcessRunTasks().items.query<DbTask>({
        query: 'SELECT * FROM c WHERE c.processId = @processId AND c.runId = @runId ORDER BY c.createdAt',
        parameters: [
            { name: '@processId', value: processId },
            { name: '@runId', value: runId }]
    }).fetchAll()).resources;
}

export async function setTaskState(accountId: string, userId: string, processId: string, runId: string, taskDefinitionId: string, state: TaskState) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions

    // Create task if not exists
    const taskExists = ((await cosmosDataContainerProcessRunTasks().items.query<number>({
        query: 'SELECT VALUE COUNT(1) FROM c WHERE c.processId = @processId AND c.runId = @runId AND c.taskDefinitionId = @taskDefinitionId',
        parameters: [
            { name: '@processId', value: processId },
            { name: '@runId', value: runId },
            { name: '@taskDefinitionId', value: taskDefinitionId }]
    }).fetchAll()).resources[0] ?? 0) > 0;
    if (!taskExists) {
        await cosmosDataContainerProcessRunTasks().items.create<DbTask>({
            id: `task_${nanoid()}`,
            processId,
            runId,
            taskDefinitionId,
            publicId: await publicIdNext(cosmosDataContainerProcessRunTasks(), 6),
            state,
            createdBy: userId,
            createdAt: new Date(),
            accountId
        });
        return;
    }

    // Update task state
    const taskId = (await cosmosDataContainerProcessRunTasks().items.query<string>({
        query: 'SELECT VALUE c.id FROM c WHERE c.processId = @processId AND c.runId = @runId AND c.taskDefinitionId = @taskDefinitionId',
        parameters: [
            { name: '@processId', value: processId },
            { name: '@runId', value: runId },
            { name: '@taskDefinitionId', value: taskDefinitionId }]
    }).fetchAll()).resources[0];
    if (!taskId)
        throw new Error('Not found');

    // Update task state
    await cosmosDataContainerProcessRunTasks().item(taskId).patch({
        operations: [
            { op: 'add', path: '/state', value: state },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });

    // Calculate process run state
    const [taskDefinitions, tasks, run] = await Promise.all([
        getTaskDefinitions(userId, processId), // TODO: (optimization) Can use only count
        getTasks(userId, processId, runId), // TODO: (optimization) Can use only count of completed tasks
        getProcessRun(userId, processId, runId)
    ]);
    const tasksCompletedCount = tasks.filter(t => t.state === 'completed').length;
    const newRunState = taskDefinitions.length === tasksCompletedCount ? 'completed' : 'running';
    if (run?.state !== newRunState) {
        await cosmosDataContainerProcessRuns().item(runId).patch({
            operations: [
                { op: 'add', path: '/state', value: newRunState },
                { op: 'add', path: '/updatedBy', value: userId },
                { op: 'add', path: '/updatedAt', value: new Date() }
            ]
        });
    }
}

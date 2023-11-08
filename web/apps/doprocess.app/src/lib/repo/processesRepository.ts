import { and, eq, inArray, like, sql } from 'drizzle-orm';
import { firstOrDefault } from '@signalco/js';
import { TaskState, process, processRun, task, taskDefinition } from '../db/schema';
import { db } from '../db';

function processSharedWithUser(userId: string) {
    return like(process.sharedWithUsers, `%\"${userId}\"%`);
}

async function isProcessSharedWithUser(userId: string) {
    return (firstOrDefault(await db.select({ count: sql<number>`count(*)` }).from(process).where(processSharedWithUser(userId)))?.count ?? 0) > 0;
}

export async function getProcesses(userId: string) {
    return await db.select().from(process).where(processSharedWithUser(userId));
}

export async function getProcess(userId: string, id: number) {
    return firstOrDefault(await db.select().from(process).where(and(processSharedWithUser(userId), eq(process.id, id))));
}

export async function createProcess(userId: string, name: string) {
    return (await db.insert(process).values({ name: name, sharedWithUsers: [userId] })).insertId;
}

export async function renameProcess(userId: string, id: number, name: string) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions

    await db.update(process).set({ name: name }).where(eq(process.id, id));
}

export async function deleteProcess(userId: string, id: number) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions

    await deleteProcessTaskDefinitions(userId, id);
    await db.delete(process).where(eq(process.id, id));
}

export async function getAllProcessesRuns(userId: string) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    const processes = await getProcesses(userId);
    const processesIds = processes.map(p => p.id);
    return await db.select().from(processRun).where(inArray(processRun.processId, processesIds));
}

export async function getProcessRuns(userId: string, processId: number) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    return await db.select().from(processRun).where(eq(processRun.processId, processId));
}

export async function getProcessRun(userId: string, processId: number, runId: number) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    return firstOrDefault(await db.select().from(processRun).where(and(eq(processRun.processId, processId), eq(processRun.id, runId))));
}

export async function runProcess(userId: string, processId: number, name: string) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions

    const runId = (await db.insert(processRun).values({ processId, state: 'running', name })).insertId;
    const taskDefinitions = await getTaskDefinitions(userId, processId);
    for (const taskDefinition of taskDefinitions) {
        await db.insert(task).values({ processId: processId, runId: Number(runId), taskDefinitionId: taskDefinition.id, state: 'new' });
    }
    return runId;
}

export async function getTaskDefinitions(userId: string, processId: number) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    return await db.select().from(taskDefinition).where(eq(taskDefinition.processId, processId));
}

export async function getTaskDefinition(userId: string, processId: number, taskDefinitionId: number) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    return firstOrDefault(await db.select().from(taskDefinition).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, taskDefinitionId))));
}

export async function createTaskDefinition(userId: string, processId: number, text: string, description: string) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions
    return (await db.insert(taskDefinition).values({
        processId: processId,
        text: text,
        description: description
    })).insertId;
}

export async function changeTaskDefinitionText(userId: string, processId: number, id: number, text: string) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.update(taskDefinition).set({ text: text }).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, id)));
}

export async function changeTaskDefinitionDescription(userId: string, processId: number, id: number, description: string) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.update(taskDefinition).set({ description: description }).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, id)));
}

export async function changeTaskDefinitionType(userId: string, processId: number, id: number, type: string, typeData: string) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.update(taskDefinition).set({ type, typeData }).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, id)));
}

export async function deleteTaskDefinition(userId: string, processId: number, id: number) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.delete(taskDefinition).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, id)));
}

async function deleteProcessTaskDefinitions(userId: string, processId: number) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.delete(taskDefinition).where(eq(taskDefinition.processId, processId));
}

export async function getTasks(userId: string, processId: number, runId: number) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    return await db.select().from(task).where(and(eq(task.processId, processId), eq(task.runId, runId)));
}

export async function setTaskState(userId: string, processId: number, runId: number, taskId: number, state: TaskState) {
    if (!await isProcessSharedWithUser(userId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.update(task).set({ state }).where(and(eq(task.processId, processId), eq(task.runId, runId), eq(task.id, taskId)));
}

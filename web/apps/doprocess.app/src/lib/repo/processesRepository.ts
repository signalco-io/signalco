import { and, eq, inArray, like, sql } from 'drizzle-orm';
import { firstOrDefault , lexinsert } from '@signalco/js';
import { TaskState, process, processRun, task, taskDefinition } from '../db/schema';
import { db } from '../db';
import { publicIdNext } from './shared';

function processSharedWithUser(userId: string) {
    return like(process.sharedWithUsers, `%\"${userId}\"%`);
}

async function isProcessSharedWithUser(userId: string, processId: number) {
    return (firstOrDefault(await db.select({ count: sql<number>`count(*)` }).from(process).where(and(eq(process.id, processId), processSharedWithUser(userId))))?.count ?? 0) > 0;
}

export async function getProcessIdByPublicId(publicId: string) {
    return firstOrDefault(await db.select({ id: process.id }).from(process).where(eq(process.publicId, publicId)))?.id;
}

export async function getTaskDefinitionIdByPublicId(processPublicId: string, taskDefinitionPublicId: string) {
    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return null;
    return firstOrDefault(await db.select({ id: taskDefinition.id }).from(taskDefinition).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.publicId, taskDefinitionPublicId))))?.id;
}

export async function getProcessRunIdByPublicId(processPublicId: string, processRunPublicId: string) {
    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return null;
    return firstOrDefault(await db.select({ id: processRun.id }).from(processRun).where(and(eq(processRun.processId, processId), eq(processRun.publicId, processRunPublicId))))?.id;
}

export async function getProcessRunTaskIdByPublicId(processPublicId: string, processRunPublicId: string, taskPublicId: string) {
    const processId = await getProcessIdByPublicId(processPublicId);
    if (processId == null)
        return null;
    const processRunId = await getProcessRunIdByPublicId(processPublicId, processRunPublicId);
    if (processRunId == null)
        return null;
    return firstOrDefault(await db.select({ id: task.id }).from(task).where(and(eq(task.processId, processId), eq(task.runId, processRunId), eq(task.publicId, taskPublicId))))?.id;
}

export async function getProcesses(userId: string) {
    return await db.select().from(process).where(processSharedWithUser(userId));
}

export async function getProcess(userId: string, processId: number) {
    return firstOrDefault(await db.select().from(process).where(and(processSharedWithUser(userId), eq(process.id, processId))));
}

export async function createProcess(userId: string, name: string) {
    return (await db.insert(process).values({
        name: name,
        publicId: await publicIdNext(process),
        sharedWithUsers: [userId],
        createdBy: userId
    })).insertId;
}

export async function renameProcess(userId: string, processId: number, name: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions

    await db.update(process).set({ name, updatedBy: userId, updatedAt: new Date() }).where(eq(process.id, processId));
}

export async function deleteProcess(userId: string, processId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions

    await deleteProcessTaskDefinitions(userId, processId);
    await db.delete(process).where(eq(process.id, processId));
}

export async function getAllProcessesRuns(userId: string) {
    const processes = await getProcesses(userId);
    const processesIds = processes.map(p => p.id);
    if (!processesIds.length)
        return [];

    return await db
        .select()
        .from(processRun)
        .where(inArray(processRun.processId, processesIds))
        .orderBy(processRun.createdAt);
}

export async function getProcessRuns(userId: string, processId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    return await db
        .select()
        .from(processRun)
        .where(eq(processRun.processId, processId))
        .orderBy(processRun.createdAt);
}

export async function getProcessRun(userId: string, processId: number, runId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    return firstOrDefault(await db.select().from(processRun).where(and(eq(processRun.processId, processId), eq(processRun.id, runId))));
}

export async function runProcess(userId: string, processId: number, name: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions

    return (await db.insert(processRun).values({
        processId,
        publicId: await publicIdNext(processRun, 6),
        state: 'running',
        name,
        createdBy: userId
    })).insertId;
}

export async function deleteProcessRun(userId: string, processId: number, runId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions

    // Delete tasks
    await db.delete(task).where(and(eq(task.processId, processId), eq(task.runId, runId)));

    // Delete process run
    await db.delete(processRun).where(and(eq(processRun.processId, processId), eq(processRun.id, runId)));
}

export async function getTaskDefinitions(userId: string, processId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    return await db
        .select()
        .from(taskDefinition)
        .where(eq(taskDefinition.processId, processId))
        .orderBy(taskDefinition.order);
}

export async function getTaskDefinition(userId: string, processId: number, taskDefinitionId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    return firstOrDefault(await db.select().from(taskDefinition).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, taskDefinitionId))));
}

async function getTaskDefinitionLastOrder(userId: string, processId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    const result = await db.select({ max: sql<string>`max(${taskDefinition.order})` }).from(taskDefinition).where(eq(taskDefinition.processId, processId));
    return lexinsert(result[0]?.max);
}

export async function createTaskDefinition(userId: string, processId: number, text: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');

    // TODO: Check permissions
    return (await db.insert(taskDefinition).values({
        processId: processId,
        publicId: await publicIdNext(taskDefinition, 6),
        order: await getTaskDefinitionLastOrder(userId, processId),
        text: text,
        createdBy: userId
    })).insertId;
}

export async function changeTaskDefinitionText(userId: string, processId: number, id: number, text: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.update(taskDefinition).set({ text, updatedBy: userId, updatedAt: new Date() }).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, id)));
}

export async function changeTaskDefinitionType(userId: string, processId: number, id: number, type: string, typeData: string) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.update(taskDefinition).set({ type, typeData, updatedBy: userId, updatedAt: new Date() }).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, id)));
}

export async function deleteTaskDefinition(userId: string, processId: number, id: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions
    await db.delete(taskDefinition).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, id)));
}

async function deleteProcessTaskDefinitions(userId: string, processId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions

    // Delete tasks
    const taskDefinitions = await getTaskDefinitions(userId, processId);
    const taskDefinitionsIds = taskDefinitions.map(td => td.id);
    if (taskDefinitionsIds.length) {
        await db.delete(task).where(and(eq(task.processId, processId), inArray(task.taskDefinitionId, taskDefinitionsIds)));
    }

    // Delete task definition
    await db.delete(taskDefinition).where(eq(taskDefinition.processId, processId));
}

export async function getTasks(userId: string, processId: number, runId: number) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    return await db.select().from(task).where(and(eq(task.processId, processId), eq(task.runId, runId)));
}

export async function setTaskState(userId: string, processId: number, runId: number, taskDefinitionId: number, state: TaskState) {
    if (!await isProcessSharedWithUser(userId, processId))
        throw new Error('Not found');
    // TODO: Check permissions

    // Create task if not exists
    const taskExists = (firstOrDefault(await db.select({ count: sql<number>`count(*)` }).from(task).where(and(eq(task.processId, processId), eq(task.runId, runId), eq(task.taskDefinitionId, taskDefinitionId))))?.count ?? 0) > 0;
    if (!taskExists) {
        await db
            .insert(task)
            .values({
                processId,
                runId,
                taskDefinitionId,
                publicId: await publicIdNext(task, 6),
                state,
                createdBy: userId
            });
        return;
    }

    await db
        .update(task)
        .set({ state, updatedBy: userId, updatedAt: new Date() })
        .where(and(eq(task.processId, processId), eq(task.runId, runId), eq(task.taskDefinitionId, taskDefinitionId)));
}

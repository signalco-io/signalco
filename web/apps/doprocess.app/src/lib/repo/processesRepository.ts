import { and, eq, like } from 'drizzle-orm';
import { process, processRun, task, taskDefinition } from '../db/schema';
import { db } from '../db';

export async function getProcesses(userId: string) {
    return await db.select().from(process).where(like(process.sharedWithUsers, `%\"${userId}\"%`));
}

export async function getProcess(id: number) {
    return (await db.select().from(process).where(eq(process.id, id)))?.at(0);
}

export async function createProcess(userId: string, name: string) {
    return (await db.insert(process).values({ name: name, sharedWithUsers: [userId] })).insertId;
}

export async function renameProcess(id: number, name: string) {
    await db.update(process).set({ name: name }).where(eq(process.id, id));
}

export async function deleteProcess(id: number) {
    await deleteProcessTaskDefinitions(id);
    await db.delete(process).where(eq(process.id, id));
}

export async function getProcessRuns(processId: number) {
    return await db.select().from(processRun).where(eq(processRun.processId, processId));
}

export async function getProcessRun(processId: number, runId: number) {
    return (await db.select().from(processRun).where(and(eq(processRun.processId, processId), eq(processRun.id, runId))))?.at(0);
}

export async function runProcess(processId: number, name: string) {
    const runId = (await db.insert(processRun).values({ processId, state: 'running', name })).insertId;
    const taskDefinitions = await getTaskDefinitions(processId);
    for (const taskDefinition of taskDefinitions) {
        await db.insert(task).values({ processId: processId, runId: Number(runId), taskDefinitionId: taskDefinition.id, state: 'new' });
    }
    return runId;
}

export async function getTaskDefinitions(processId: number) {
    return await db.select().from(taskDefinition).where(eq(taskDefinition.processId, processId));
}

export async function getTaskDefinition(processId: number, taskDefinitionId: number) {
    return (await db.select().from(taskDefinition).where(and(eq(taskDefinition.processId, processId), eq(taskDefinition.id, taskDefinitionId))))?.at(0);
}

export async function createTaskDefinition(processId: number, text: string, description: string) {
    return (await db.insert(taskDefinition).values({ processId: processId, text: text, description: description })).insertId;
}

export async function changeTaskDefinitionText(id: number, text: string) {
    await db.update(taskDefinition).set({ text: text }).where(eq(taskDefinition.id, id));
}

export async function changeTaskDefinitionDescription(id: number, description: string) {
    await db.update(taskDefinition).set({ description: description }).where(eq(taskDefinition.id, id));
}

export async function deleteTaskDefinition(id: number) {
    await db.delete(taskDefinition).where(eq(taskDefinition.id, id));
}

async function deleteProcessTaskDefinitions(processId: number) {
    await db.delete(taskDefinition).where(eq(taskDefinition.processId, processId));
}

export async function getTasks(processId: number, runId: number) {
    return await db.select().from(task).where(and(eq(task.processId, processId), eq(task.runId, runId)));
}

export async function completeTask(taskId: number) {
    await db.update(task).set({ state: 'completed' }).where(eq(task.id, taskId));
}

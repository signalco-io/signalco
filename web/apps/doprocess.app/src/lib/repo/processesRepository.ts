import { and, eq } from 'drizzle-orm';
import { process, processRun, task, taskDefinition } from '../db/schema';
import { db } from '../db';

export async function getProcesses() {
    return await db.select().from(process);
}

export async function getProcess(id: number) {
    return (await db.select().from(process).where(eq(process.id, id)))?.at(0);
}

export async function createProcess(name: string) {
    return (await db.insert(process).values({ name: name })).insertId;
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

export async function runProcess(processId: number) {
    const runId = (await db.insert(processRun).values({ processId: processId, state: 'running' })).insertId;
    const taskDefinitions = await getTaskDefinitions(processId);
    for (const taskDefinition of taskDefinitions) {
        await db.insert(task).values({ processId: processId, runId: Number(runId), taskDefinitionId: taskDefinition.id, state: 'new' });
    }
}

export async function getTaskDefinitions(processId: number) {
    return await db.select().from(taskDefinition).where(eq(taskDefinition.processId, processId));
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

import { int, mysqlTable, serial, text, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const process = mysqlTable('process', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
});

export const processRun = mysqlTable('process_run', {
    id: serial('id').primaryKey(),
    processId: int('process_id').notNull(),
    state: varchar('state', { length: 255 }).notNull()
});

export const taskDefinition = mysqlTable('task_definition', {
    id: serial('id').primaryKey(),
    processId: int('process_id').notNull(),
    text: text('text'),
    description: text('description'),
    // TODO: Created by
    // TODO: Created at
    // TODO: Soft-deleted?
});

export type TaskDefinition = typeof taskDefinition.$inferSelect;

export const processRelations = relations(taskDefinition, ({ many }) => ({
    taskDefinitions: many(taskDefinition)
}))

export const taskDefinitionRelations = relations(taskDefinition, ({ one }) => ({
    user: one(process, {
        fields: [taskDefinition.processId],
        references: [process.id]
    })
}))

export const task = mysqlTable('task', {
    id: serial('id').primaryKey(),
    processId: int('process_id').notNull(),
    runId: int('run_id').notNull(),
    taskDefinitionId: int('task_definition_id').notNull(),
    state: varchar('state', { length: 255 }).notNull(),
});

export type Task = typeof task.$inferSelect;

export const taskRelations = relations(task, ({ one }) => ({
    process: one(process, {
        fields: [task.processId],
        references: [process.id]
    }),
    run: one(processRun, {
        fields: [task.runId],
        references: [processRun.id]
    }),
    taskDefinition: one(taskDefinition, {
        fields: [task.taskDefinitionId],
        references: [taskDefinition.id]
    })
}))

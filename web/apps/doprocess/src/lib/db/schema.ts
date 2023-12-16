import { datetime, index, int, json, mysqlTable, serial, text, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';

export const withPublicIdTable = {
    publicId: varchar('public_id', { length: 32 }).notNull().unique(),
};

export const process = mysqlTable('process', {
    id: serial('id').primaryKey(),
    ...withPublicIdTable,
    name: varchar('name', { length: 255 }).notNull(),
    sharedWithUsers: json('shared_with_users').$type<string[]>().notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date' }).notNull().default(sql`current_timestamp`),
    updatedBy: varchar('updated_by', { length: 255 }),
    updatedAt: datetime('updated_at', { mode: 'date' }),
}, (table) => ({
    publicIdIdx: uniqueIndex('public_id_idx').on(table.publicId)
}));

export type Process = typeof process.$inferSelect;

export const processRun = mysqlTable('process_run', {
    id: serial('id').primaryKey(),
    ...withPublicIdTable,
    processId: int('process_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    state: varchar('state', { length: 255 }).notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date' }).notNull().default(sql`current_timestamp`),
    updatedBy: varchar('updated_by', { length: 255 }),
    updatedAt: datetime('updated_at', { mode: 'date' }),
}, (table) => ({
    processIdIdx: index('process_id_idx').on(table.processId),
    publicIdIdx: index('public_id_idx').on(table.publicId),
}));

export type ProcessRun = typeof processRun.$inferSelect;

export const taskDefinition = mysqlTable('task_definition', {
    id: serial('id').primaryKey(),
    ...withPublicIdTable,
    processId: int('process_id').notNull(),
    text: text('text'),
    order: varchar('order', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }),
    typeData: varchar('type_source', { length: 255 }),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date' }).notNull().default(sql`current_timestamp`),
    updatedBy: varchar('updated_by', { length: 255 }),
    updatedAt: datetime('updated_at', { mode: 'date' }),
}, (table) => ({
    processIdIdx: index('process_id_idx').on(table.processId),
    publicIdIdx: index('public_id_idx').on(table.publicId),
}));

export type TaskDefinition = typeof taskDefinition.$inferSelect;

export const document = mysqlTable('document', {
    id: serial('id').primaryKey(),
    ...withPublicIdTable,
    name: text('name').notNull(),
    data: json('data'),
    sharedWithUsers: json('shared_with_users').$type<string[]>().notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date' }).notNull().default(sql`current_timestamp`),
    updatedBy: varchar('updated_by', { length: 255 }),
    updatedAt: datetime('updated_at', { mode: 'date' }),
}, (table) => ({
    publicIdIdx: uniqueIndex('public_id_idx').on(table.publicId),
}));

export type Document = typeof document.$inferSelect;

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
    ...withPublicIdTable,
    processId: int('process_id').notNull(),
    runId: int('run_id').notNull(),
    taskDefinitionId: int('task_definition_id').notNull(),
    state: varchar('state', { length: 255 }).notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date' }).notNull().default(sql`current_timestamp`),
    updatedBy: varchar('changed_by', { length: 255 }),
    updatedAt: datetime('changed_at', { mode: 'date' })
}, (table) => ({
    processIdIdx: index('process_id_idx').on(table.processId),
    runIdIdx: index('run_id_idx').on(table.runId),
    taskDefinitionIdIdx: index('task_definition_id_idx').on(table.taskDefinitionId),
    publicIdIdx: index('public_id_idx').on(table.publicId),
}));

export type TaskState = 'new' | 'completed';

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

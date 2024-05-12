import { DbDocument, DbProcess, DbProcessRun, DbTask, DbTaskDefinition } from '../../../src/lib/db/schema';

export type ProcessDto = Omit<DbProcess, 'publicId' | 'id'> & { id: string };

export type ProcessRunDto = Omit<DbProcessRun, 'publicId' | 'id' | 'processId'> & { id: string, processId: string };

export type ProcessTaskDefinitionDto = Omit<DbTaskDefinition, 'publicId' | 'id' | 'processId'> & { id: string, processId: string };

export type ProcessTaskDefinitionsSuggestionsDto = { suggestions: string[] };

export type ProcessRunTaskDto = Omit<DbTask, 'publicId' | 'id' | 'processId' | 'taskDefinitionId'> & { id: string, processId: string, taskDefinitionId: string };

export type DocumentDto = Omit<DbDocument, 'publicId' | 'id'> & { id: string };

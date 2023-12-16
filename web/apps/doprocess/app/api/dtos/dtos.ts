import { Document, Process, ProcessRun, Task, TaskDefinition } from '../../../src/lib/db/schema';

export type ProcessDto = Omit<Process, 'publicId' | 'id'> & { id: string };

export type ProcessRunDto = Omit<ProcessRun, 'publicId' | 'id' | 'processId'> & { id: string, processId: string };

export type ProcessTaskDefinitionDto = Omit<TaskDefinition, 'publicId' | 'id' | 'processId'> & { id: string, processId: string };

export type ProcessTaskDefinitionsSuggestionsDto = { suggestions: string[] };

export type ProcessRunTaskDto = Omit<Task, 'publicId' | 'id' | 'processId' | 'taskDefinitionId'> & { id: string, processId: string, taskDefinitionId: string };

export type DocumentDto = Omit<Document, 'publicId' | 'id'> & { id: string };

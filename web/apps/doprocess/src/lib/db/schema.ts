export type DbWithPublicId = {
    publicId: string;
};

type DbWithTimestamps = {
    createdAt: Date;
    updatedAt?: Date;
};

type DbWithBlame = {
    createdBy: string;
    updatedBy?: string;
};

export type DbProcess = DbWithPublicId & DbWithTimestamps & DbWithBlame & {
    id: number;
    name: string;
    sharedWithUsers: string[];
};

export type DbProcessRun = DbWithPublicId & DbWithTimestamps & DbWithBlame & {
    id: number;
    processId: number;
    name: string;
    state: string;
};

export type DbTaskDefinition = DbWithPublicId & DbWithTimestamps & DbWithBlame & {
    id: number;
    processId: number;
    text: string;
    order: string;
    type: string;
    typeData: string;
};

export type DbDocument = DbWithPublicId & DbWithTimestamps & DbWithBlame & {
    id: number;
    name: string;
    dataJson: string;
    sharedWithUsers: string[];
};

export type TaskState = 'new' | 'completed';

export type DbTask = DbWithPublicId & DbWithTimestamps & DbWithBlame & {
    id: number;
    processId: number;
    runId: number;
    taskDefinitionId: number;
    state: TaskState;
};

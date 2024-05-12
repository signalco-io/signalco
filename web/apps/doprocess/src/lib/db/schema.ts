export type DbWithPublicId = {
    publicId: string;
};

export type DbWithTimestamps = {
    createdAt: Date;
    updatedAt?: Date;
};

export type DbWithBlame = {
    createdBy: string;
    updatedBy?: string;
};

export type DbWithShare = {
    sharedWithUsers: string[];
};

export type DbProcess = DbWithPublicId & DbWithTimestamps & DbWithBlame & DbWithShare & {
    id: string;
    name: string;
};

export type DbProcessRun = DbWithPublicId & DbWithTimestamps & DbWithBlame & {
    id: string;
    processId: string;
    name: string;
    state: string;
};

export type DbTaskDefinition = DbWithPublicId & DbWithTimestamps & DbWithBlame & {
    id: string;
    processId: string;
    text: string;
    order: string;
    type?: string;
    typeData?: string;
};

export type DbDocument = DbWithPublicId & DbWithTimestamps & DbWithBlame & DbWithShare & {
    id: string;
    name: string;
    dataJson?: string;
};

export type TaskState = 'new' | 'completed';

export type DbTask = DbWithPublicId & DbWithTimestamps & DbWithBlame & {
    id: string;
    processId: string;
    runId: string;
    taskDefinitionId: string;
    state: TaskState;
};

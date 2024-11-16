export type DbComment = {
    id: string;
    domain: string;
    path: string;
    position: object, // TODO: Type
    thread: object, // TODO: Type
    device?: object, // TODO: Type
    resolved?: boolean;
};

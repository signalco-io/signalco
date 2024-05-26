import { nanoid } from 'nanoid';
import { DbDocument } from '../db/schema';
import { cosmosDataContainerDocuments } from '../db/client';
import { entityIdByPublicId, entitySharedWithUser, publicIdNext } from './shared';

async function isDocumentSharedWithUser(userId: string, documentId: string) {
    const document = await cosmosDataContainerDocuments().item(documentId).read<DbDocument>();
    return document.resource && entitySharedWithUser(userId, document.resource);
}

export async function documentCreate(accountId: string, userId: string, name: string, basedOn?: string) {
    const container = cosmosDataContainerDocuments();
    const documentId = `document_${nanoid()}`;
    await container.items.create<DbDocument>({
        id: documentId,
        name,
        publicId: await publicIdNext(container),
        sharedWithUsers: [userId],
        createdBy: userId,
        createdAt: new Date(),
        accountId
    });

    // Copy content to new document (if basedOn is provided)
    if (basedOn) {
        const basedOnId = await entityIdByPublicId(container, basedOn);
        if (basedOnId) {
            const basedOnDocument = await documentGet(userId, basedOnId);
            if (basedOnDocument && typeof basedOnDocument.dataJson === 'string') {
                console.info('Copying document content from (public):', basedOnDocument.publicId, 'to (internal):', documentId);
                await documentSetData(userId, documentId, basedOnDocument.dataJson);
            }
        }
    }

    return documentId;
}

export async function documentsGet(userId: string) {
    return (await cosmosDataContainerDocuments().items.query<DbDocument>({
        query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(c.sharedWithUsers, @userId)',
        parameters: [{ name: '@userId', value: userId }]
    }).fetchAll()).resources;
}

export async function documentGet(userId: string | null, id: string) {
    const item = await cosmosDataContainerDocuments().item(id).read<DbDocument>();
    if (!item.resource || !entitySharedWithUser(userId, item.resource))
        return undefined;
    return item.resource;
}

export async function documentRename(userId: string, id: string, name: string) {
    if (!await isDocumentSharedWithUser(userId, id))
        throw new Error('Not found');

    await cosmosDataContainerDocuments().item(id).patch({
        operations: [
            { op: 'add', path: '/name', value: name },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function documentSetData(userId: string, id: string, data?: string) {
    if (!await isDocumentSharedWithUser(userId, id))
        throw new Error('Not found');

    await cosmosDataContainerDocuments().item(id).patch({
        operations: [
            { op: 'add', path: '/dataJson', value: data },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function documentSetSharedWithUsers(userId: string, id: string, sharedWithUsers: string[]) {
    if (!await isDocumentSharedWithUser(userId, id))
        throw new Error('Not found');

    await cosmosDataContainerDocuments().item(id).patch({
        operations: [
            { op: 'add', path: '/sharedWithUsers', value: sharedWithUsers },
            { op: 'add', path: '/updatedBy', value: userId },
            { op: 'add', path: '/updatedAt', value: new Date() }
        ]
    });
}

export async function documentDelete(userId: string, id: string) {
    if (!await isDocumentSharedWithUser(userId, id))
        throw new Error('Not found');

    await cosmosDataContainerDocuments().item(id).delete();
}

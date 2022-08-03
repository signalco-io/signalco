import { useCallback } from 'react';
import IContactPointer from 'src/contacts/IContactPointer';
import EntityRepository from 'src/entity/EntityRepository';
import useLoadAndError from './useLoadAndError';

export default function useContact(pointer: IContactPointer | undefined) {
    const loadFunc = useCallback(() => pointer ? EntityRepository.contactAsync(pointer) : undefined, [pointer]);
    return useLoadAndError(loadFunc);
}

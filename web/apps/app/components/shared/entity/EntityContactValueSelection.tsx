import React from 'react';
import { Loadable } from '@signalco/ui/Loadable';
import useContact from '../../../src/hooks/signalco/useContact';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import IContactPointer from '../../../src/contacts/IContactPointer';
import InputContactValue from './InputContactValue';

export type EntityContactValueSelectionProps = {
    target: IContactPointer;
    valueSerialized: string | undefined;
    onSelected: (valueSerialized: string | undefined) => void;
};

export default function EntityContactValueSelection({ target, valueSerialized, onSelected }: EntityContactValueSelectionProps) {
    const entity = useEntity(target?.entityId);

    const targetFull = target && target.entityId && target.channelName && target.contactName
        ? { entityId: target.entityId, contactName: target.contactName, channelName: target.channelName }
        : undefined;
    const contact = useContact(targetFull);

    return (
        <Loadable isLoading={entity.isLoading} loadingLabel="Loading value" error={entity.error}>
            {(target && targetFull && contact) && (
                <InputContactValue
                    contact={contact.data}
                    value={valueSerialized}
                    onChange={onSelected} />
            )}
        </Loadable>
    );
}

import React, { useMemo } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { WidgetSharedProps } from '../Widget';
import TvVisual from '../../icons/TvVisual';
import LightBulbVisual from '../../icons/LightBulbVisual';
import FanVisual from '../../icons/FanVisual';
import { DefaultLabel, DefaultTargetWithValueMultiple } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useAudioOn from '../../../src/hooks/sounds/useAudioOn';
import useAudioOff from '../../../src/hooks/sounds/useAudioOff';
import useContacts from '../../../src/hooks/signalco/useContacts';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import { entityAsync } from '../../../src/entity/EntityRepository';
import type IContactPointer from '../../../src/contacts/IContactPointer';
import IContact from '../../../src/contacts/IContact';
import ConductsService from '../../../src/conducts/ConductsService';
import { WidgetSpinner } from './piece/WidgetSpinner';

type ConfigProps = {
    label: string,
    on: IContact[] | undefined;
    off: IContact[] | undefined;
    visual: string;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { ...DefaultTargetWithValueMultiple, name: 'on', label: 'On' },
    { ...DefaultTargetWithValueMultiple, name: 'off', label: 'Off' },
    { name: 'visual', label: 'Visual', type: 'selectVisual', default: 'lightbulb' },
];

export type StateAction = IContactPointer & {
    valueSerialized?: string,
    delay?: number
};

const determineActionValueAsync = async (action: StateAction) => {
    if (typeof action.valueSerialized === 'undefined') {
        // Retrieve device and determine whether contact is action contact
        const entity = await entityAsync(action.entityId);
        const contact = entity
            ? entity.contacts.find(c => c.channelName === action.channelName && c.contactName === action.contactName)
            : undefined;
        const contactValueSerializedLowerCase = contact?.valueSerialized?.toLocaleLowerCase();
        const isAction = contact
            ? contactValueSerializedLowerCase === 'true' || contactValueSerializedLowerCase === 'false'
            : false;

        if (!isAction) {
            if (typeof contact === 'undefined') {
                console.warn('Failed to retrieve button action source state', action)
                showNotification('Conduct action new value can\'t be determined.', 'warning');
                return null;
            }

            // TODO: Only use boolean resolved when contact is boolean
            // Set negated boolean value
            return !(`${contact.valueSerialized}`.toLowerCase() === 'true');
        }
    } else {
        return action.valueSerialized;
    }
};

export const executeStateActionsAsync = async (actions: StateAction[]) => {
    const conducts = [];
    for (const action of actions) {
        if (typeof action.entityId === 'undefined' ||
            typeof action.channelName === 'undefined' ||
            typeof action.contactName === 'undefined') {
            console.warn('Action has invalid target', action)
            showNotification('Conduct has missing target data.', 'warning');
            continue;
        }

        const newValue = await determineActionValueAsync(action);

        conducts.push({ pointer: action, value: newValue, delay: action.delay ?? 0 });
    }

    await ConductsService.RequestMultipleConductAsync(conducts);
};

function WidgetState(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;
    const onContactPointers = useMemo(() => Array.isArray(config?.on) ? config?.on as IContactPointer[] : undefined, [config?.on]);
    const onEntityIds = useMemo(() => onContactPointers?.map(i => i.entityId), [onContactPointers]);
    const onEntity = useEntity(onEntityIds && onEntityIds[0]);
    const onContacts = useContacts(onContactPointers);

    const audioOn = useAudioOn();
    const audioOff = useAudioOff();

    const isLoading = !onContacts || onEntity.isLoading || onEntity.isPending;

    // Calc state from source value
    // If atleast one contact is true, this widget will set it's state to true
    let state = false;
    if (onContacts) {
        for (let i = 0; i < onContacts.length; i++) {
            const contact = onContacts[i];
            if (typeof contact === 'undefined' || !contact.data)
                continue;

            const contactOnValueSerialized = config?.on?.find((e: IContact) =>
                e.entityId === contact.data?.entityId &&
                e.channelName === contact.data?.channelName &&
                e.contactName === contact.data?.contactName)?.valueSerialized;
            if (contact.data.valueSerialized === contactOnValueSerialized) {
                state = true;
                break;
            }
        }
    }

    const label = props.config?.label || (typeof onEntity !== 'undefined' ? onEntity.data?.alias : '');
    const Visual = useMemo(() => props.config?.visual === 'tv' ? TvVisual : (props.config?.visual === 'fan' ? FanVisual : LightBulbVisual), [props.config]);

    const handleStateChangeRequest = () => {
        if (typeof onEntity === 'undefined') {
            console.warn('State change requested but device is undefined.');
            showNotification('Can\'t execute action, widget is not loaded yet.', 'warning');
            return;
        }

        (state ? audioOn : audioOff).play();

        const targets = state ? config?.off : config?.on;
        executeStateActionsAsync((targets as IContact[]).map(d => ({
            entityId: d.entityId,
            channelName: d.channelName,
            contactName: d.contactName,
            valueSerialized: d.valueSerialized,
        })));
    };

    // Configure widget
    useWidgetOptions(stateOptions, props);

    return (
        <Button
            onClick={handleStateChangeRequest}
            variant="plain"
            className="m-0 size-full !items-start !justify-start p-0 text-start"
            disabled={isLoading}>
            <Stack className="relative size-full items-start p-2">
                <div className="grow">
                    <Visual state={state} size={80} />
                </div>
                <Typography semiBold noWrap level="body1">{label}</Typography>
            </Stack>
            <WidgetSpinner isLoading={isLoading} />
        </Button>
    );
}

export default WidgetState;

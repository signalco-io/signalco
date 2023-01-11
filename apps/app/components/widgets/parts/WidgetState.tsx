import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic'
import { Button, Typography, Box, CircularProgress, Stack } from '@signalco/ui';
import { WidgetSharedProps } from '../Widget';
import { DefaultLabel, DefaultTargetWithValueMultiple } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { showNotification } from '../../../src/notifications/PageNotificationService';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useEntity from '../../../src/hooks/signalco/useEntity';
import useContacts from '../../../src/hooks/signalco/useContacts';
import { entityAsync } from '../../../src/entity/EntityRepository';
import type IContactPointer from '../../../src/contacts/IContactPointer';
import IContact from '../../../src/contacts/IContact';
import ConductsService from '../../../src/conducts/ConductsService';

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

const TvVisual = dynamic(() => import('../../icons/TvVisual'));
const LightBulbVisual = dynamic(() => import('../../icons/LightBulbVisual'));

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

    const [isLoading, setIsLoading] = useState(true);

    // Calc state from source value
    // If atleast one contact is true, this widget will set it's state to true
    let state = false;
    if (onContacts) {
        for (let i = 0; i < onContacts.length; i++) {
            const contact = onContacts[i];
            if (typeof contact === 'undefined' || !contact.data)
                continue;

            if (contact.data.valueSerialized === config?.on?.find((e: IContact) =>
                e.entityId === contact.data.entityId &&
                e.channelName === contact.data.channelName &&
                e.contactName === contact.data.contactName)?.valueSerialized) {
                state = true;
                break;
            }
        }
    }

    // Hide loading when loaded fully
    if (isLoading && onContacts && !onEntity.isLoading)
        setIsLoading(false);

    const label = props.config?.label || (typeof onEntity !== 'undefined' ? onEntity.data?.alias : '');
    const Visual = useMemo(() => props.config?.visual === 'tv' ? TvVisual : LightBulbVisual, [props.config]);

    const handleStateChangeRequest = () => {
        if (typeof onEntity === 'undefined') {
            console.warn('State change requested but device is undefined.');
            showNotification('Can\'t execute action, widget is not loaded yet.', 'warning');
            return;
        }

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
            sx={{ borderRadius: 'md', position: 'relative', height: '100%', width: 'calc(100% - 2px)', display: 'block', textAlign: 'left', margin: 0, padding: 0 }}
            onClick={handleStateChangeRequest}
            variant="plain">
            <Stack style={{ height: '100%', paddingTop: 16, paddingBottom: 16 }}>
                <Box sx={{ px: 2 }}>
                    <Visual state={state} size={68} />
                </Box>
                <Box sx={{ px: 2 }}>
                    <Typography fontWeight="500" noWrap>{label}</Typography>
                </Box>
            </Stack>
            {isLoading && (
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <CircularProgress size="sm" />
                </Box>
            )}
        </Button>
    );
}

export default WidgetState;

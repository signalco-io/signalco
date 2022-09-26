import { Stack, Typography, ButtonBase, CircularProgress } from '@mui/material';
import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic'
import ConductsService from '../../../src/conducts/ConductsService';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import { Box } from '@mui/system';
import { WidgetSharedProps } from '../Widget';
import useEntities from '../../../src/hooks/useEntities';
import { DefaultLabel, DefaultTargetMultiple } from '../../../src/widgets/WidgetConfigurationOptions';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useWidgetActive from '../../../src/hooks/widgets/useWidgetActive';
import IContactPointer from 'src/contacts/IContactPointer';
import { contactAsync, entityAsync } from 'src/entity/EntityRepository';
import useContacts from 'src/hooks/useContacts';

const stateOptions = [
    DefaultLabel,
    DefaultTargetMultiple,
    { name: 'visual', label: 'Visual', type: 'select', default: 'lightbulb', data: [{ label: 'TV', value: 'tv' }, { label: 'Light bulb', value: 'lightbulb' }] },
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
            ? await contactAsync(action)
            : undefined;
        const contactValueSerializedLowerCase = contact?.valueSerialized?.toLocaleLowerCase();
        const isAction = contact
            ? contactValueSerializedLowerCase === 'true' || contactValueSerializedLowerCase === 'false'
            : false;

        if (!isAction) {
            if (typeof contact === 'undefined') {
                console.warn('Failed to retrieve button action source state', action)
                PageNotificationService.show('Conduct action new value can\'t be determined.', 'warning');
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
            PageNotificationService.show('Conduct has missing target data.', 'warning');
            continue;
        }

        const newValue = await determineActionValueAsync(action);

        conducts.push({ pointer: action, value: newValue, delay: action.delay ?? 0 });
    }

    await ConductsService.RequestMultipleConductAsync(conducts);
};

function WidgetState(props: WidgetSharedProps) {
    const { config } = props;
    const contactPointers = useMemo(() => (Array.isArray(config?.target) ? config.target as IContactPointer[] : undefined), [config?.target]);
    const entityIds = useMemo(() => (Array.isArray(config?.target) ? config.target as IContactPointer[] : undefined)?.map(i => i.entityId), [config?.target]);
    const entities = useEntities(entityIds);
    const contacts = useContacts(contactPointers);
    const [isLoading, setIsLoading] = useState(true);

    // Calc state from source value
    // If atleast one contact is true, this widget will set it's state to true
    let state = false;
    if (contacts) {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            if (typeof contact === 'undefined')
                continue;

            if (contact?.valueSerialized === 'true') {
                state = true;
                break;
            }
        }

        if (isLoading)
            setIsLoading(false);
    }

    const label = props.config?.label || (typeof entities !== 'undefined' ? entities[0]?.alias : '');
    const Visual = useMemo(() => props.config?.visual === 'tv' ? TvVisual : LightBulbVisual, [props.config]);

    const handleStateChangeRequest = () => {
        if (typeof entities === 'undefined') {
            console.warn('State change requested but device is undefined.');
            PageNotificationService.show('Can\'t execute action, widget is not loaded yet.', 'warning');
            return;
        }

        executeStateActionsAsync((config.target as IContactPointer[]).map(d => ({
            entityId: d.entityId,
            channelName: d.channelName,
            contactName: d.contactName,
            valueSerialized: state ? 'false' : 'true',
        })));
    };

    // Configure widget
    useWidgetOptions(stateOptions, props);
    useWidgetActive(state, props);

    return (
        <ButtonBase sx={{ position: 'relative', height: '100%', width: '100%', display: 'block', textAlign: 'left', borderRadius: 2 }} onClick={handleStateChangeRequest} >
            <Stack sx={{ height: '100%', py: 2 }}>
                <Box sx={{ px: 2 }}>
                    <Visual state={state} size={68} />
                </Box>
                <Box sx={{ px: 2 }}>
                    <Typography fontWeight="light" noWrap>{label}</Typography>
                </Box>
            </Stack>
            {isLoading && (
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
        </ButtonBase>
    );
}

export default WidgetState;

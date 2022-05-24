import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, List, ListItem, ListItemButton, ListItemText, Popover, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { startTransition, useEffect, useState } from 'react';
import { IDeviceModel, IDeviceTargetIncomplete } from '../../../src/devices/Device';
import { selectMany } from '../../../src/helpers/ArrayHelpers';
import {
    usePopupState,
    bindTrigger,
    bindPopover
} from 'material-ui-popup-state/hooks';
import useAllEntities from '../../../src/hooks/useAllEntities';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EntityIcon from './EntityIcon';
import Loadable from '../Loadable/Loadable';
import useEntity from '../../../src/hooks/useEntity';
import { Edit as EditIcon } from '@mui/icons-material';
import NoDataPlaceholder from '../indicators/NoDataPlaceholder';

const EntitySelection = (props: { target: IDeviceTargetIncomplete | undefined, onSelected: (target: IDeviceTargetIncomplete | undefined) => void; }) => {
    const {
        target, onSelected
    } = props;

    const entities = useAllEntities();
    const handleDeviceSelected = (selectedEntity: IDeviceModel | undefined) => {
        onSelected(selectedEntity ? { deviceId: selectedEntity.id } : undefined);
    };

    return (
        <Loadable isLoading={entities.isLoading} error={entities.error}>
            <List>
                <ListItem selected={!target?.deviceId} disablePadding>
                    <ListItemButton onClick={() => handleDeviceSelected(undefined)}>
                        <ListItemText>None</ListItemText>
                    </ListItemButton>
                </ListItem>
                {entities.items.map(entity => (
                    <ListItem selected={target?.deviceId === entity.id} key={entity.id} disablePadding>
                        <ListItemButton onClick={() => handleDeviceSelected(entity)}>
                            <ListItemText>{entity.alias}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Loadable>
    );
};

const EntityContactSelection = (props: { target: IDeviceTargetIncomplete, contactAccess?: number, onSelected: (target: IDeviceTargetIncomplete | undefined) => void }) => {
    const {
        target, contactAccess, onSelected
    } = props;

    const { item: entity, isLoading, error } = useEntity(target?.deviceId);
    const contacts = selectMany(entity?.endpoints ?? [], e => e.contacts.filter(c => !contactAccess || c.access & contactAccess).map(c => {
        return {
            deviceId: entity!.id,
            contactName: c.name,
            channelName: e.channel
        };
    }));

    const handleContactSelected = (contact: IDeviceTargetIncomplete) => {
        onSelected(contact);
    }

    if (!isLoading && !error && !contacts.length) {
        return <NoDataPlaceholder content={'No applicable contacts available'} />;
    }

    return (
        <Loadable isLoading={isLoading} error={error}>
            <List>
                <ListItem selected={!target.contactName || !target.channelName} disablePadding>
                    <ListItemButton onClick={() => handleContactSelected({ deviceId: target.deviceId })}>
                        <ListItemText>None</ListItemText>
                    </ListItemButton>
                </ListItem>
                {contacts.map(c => (
                    <ListItem selected={target.channelName === c.channelName && target.contactName === c.contactName} key={`${c.channelName}-${c.contactName}`} disablePadding>
                        <ListItemButton onClick={() => handleContactSelected(c)}>
                            <ListItemText>{c.contactName}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Loadable>
    );
};

function EntitySelectionMenu(props: { target?: IDeviceTargetIncomplete; contactAccessFilter?: number, onSelected: (target: IDeviceTargetIncomplete | undefined) => void, onClose: () => void }) {
    const {
        target, contactAccessFilter: contactAccess, onSelected, onClose
    } = props;
    const [selectingEntity, setSelectingEntity] = useState(false);
    const [selectingContact, setSelectingContact] = useState(false);
    const [selectingValue, setSelectingValue] = useState(false);
    const entitySelected = target?.deviceId;

    useEffect(() => {
        if (target?.deviceId) {
            startTransition(() => {
                setSelectingContact(true);
                setSelectingEntity(false);
            });
        } else {
            startTransition(() => {
                setSelectingEntity(true);
                setSelectingContact(false);
            });
        }
    }, [target]);

    const handleEditEntity = () => {
        startTransition(() => {
            setSelectingContact(false);
            setSelectingEntity(true);
        });
    };

    const handleEntitySelected = (target: IDeviceTargetIncomplete | undefined) => {
        onSelected(target);
    };

    const handleContactSelected = (target: IDeviceTargetIncomplete | undefined) => {
        onSelected(target);
        if (target?.channelName && target?.contactName) {
            onClose();
        }
    };

    return (
        <Stack sx={{ height: '100%' }}>
            <Accordion expanded={selectingEntity} onChange={handleEditEntity} disableGutters TransitionProps={{ unmountOnExit: true, timeout: 150 }}>
                <AccordionSummary
                    expandIcon={!selectingEntity && <EditIcon />}>
                    {entitySelected ? (
                        <EntityIconLabel entityId={target.deviceId} />
                    ) : (
                        <Typography variant="body2" color="textSecondary">Select entity</Typography>
                    )}
                </AccordionSummary>
                <AccordionDetails>
                    <EntitySelection target={target} onSelected={handleEntitySelected} />
                </AccordionDetails>
            </Accordion>
            <Accordion disabled={!entitySelected} expanded={selectingContact} disableGutters TransitionProps={{ unmountOnExit: true, timeout: 150 }} sx={{ flexGrow: 1 }}>
                <AccordionSummary>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <Typography>Contact</Typography>
                        {!entitySelected && <Typography variant="body2" color="textSecondary">Select entity first</Typography>}
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <EntityContactSelection target={target!} contactAccess={contactAccess} onSelected={handleContactSelected} />
                </AccordionDetails>
            </Accordion>
        </Stack >
    );
}


function EntityIconLabel(props: { entityId: string | undefined, description?: string }) {
    const { entityId, description } = props;
    const { item: entity, isLoading } = useEntity(entityId);

    const entityName = entity?.alias ?? (entity?.identifier);
    const Icon = EntityIcon(entity);

    return (
        <Tooltip title={entityName || ''}>
            <Stack spacing={2} direction="row" alignItems="center" minWidth={0}>
                {entity && <Icon />}
                <Stack alignItems="start" minWidth={0}>
                    <Typography noWrap maxWidth="100%">
                        {isLoading ? <Skeleton width={160} variant="text" /> : entityName}
                    </Typography>
                    {!isLoading && (
                        <Typography variant="caption" color="textSecondary">
                            {description}
                        </Typography>
                    )}
                </Stack>
            </Stack>
        </Tooltip>
    );
}

export interface DisplayEntityTargetProps {
    isLoading?: boolean;
    target?: IDeviceTargetIncomplete;
    selectContact?: boolean;
    contactAccessFilter?: number;
    selectValue?: boolean;
    onChanged: (updated?: IDeviceTargetIncomplete) => void;
}

function DisplayDeviceTarget(props: DisplayEntityTargetProps) {
    const {
        target,
        selectContact, contactAccessFilter,
        selectValue,
        onChanged
    } = props;
    const entityMenu = usePopupState({ variant: 'popover', popupId: 'entitytarget-menu' });

    const handleEntitySelected = (target: IDeviceTargetIncomplete | undefined) => {
        onChanged && onChanged(target);
    };

    const handleEntitySelectionClose = () => {
        startTransition(entityMenu.close);
    }

    let entityDescription = '';
    if (!target?.deviceId) entityDescription = 'Select entity';

    return (
        <>
            <Button variant="outlined" fullWidth sx={{ minHeight: 56 }} {...bindTrigger(entityMenu)}>
                <Stack sx={{ width: '100%' }} spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                    <EntityIconLabel entityId={target?.deviceId} description={entityDescription} />
                    <Stack spacing={1} direction="row" alignItems="center">
                        {(target && target.contactName && selectContact) && (
                            <Chip label={target.contactName ?? 'None'} />
                        )}
                        <ChevronRightIcon />
                    </Stack>
                </Stack>
            </Button>
            <Popover
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                {...bindPopover(entityMenu)}>
                <Box sx={{ width: 420, height: 620 }}>
                    <EntitySelectionMenu
                        target={target}
                        contactAccessFilter={contactAccessFilter}
                        onSelected={handleEntitySelected}
                        onClose={handleEntitySelectionClose} />
                </Box>
            </Popover>
        </>
    );
}

export default observer(DisplayDeviceTarget);

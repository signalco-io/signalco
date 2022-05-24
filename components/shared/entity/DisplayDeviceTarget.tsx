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
import NoDataPlaceholder from '../indicators/NoDataPlaceholder';
import { InputDeviceContactValue } from '../../../pages/app/entities/[id]';

const EntityContactValueSelection = (props: { target: IDeviceTargetIncomplete | undefined, value: any, onSelected: (value: any) => void }) => {
    const { target, value, onSelected } = props;
    const entity = useEntity(target?.deviceId);

    const targetFull = target && target.channelName && target.contactName
        ? { deviceId: target.deviceId, contactName: target.contactName, channelName: target.channelName }
        : undefined;
    const contact = targetFull ? entity.item?.getContact(targetFull) : undefined;

    const handleChange = (newValue: any) => {
        onSelected(newValue);
    };

    return (
        <Loadable isLoading={entity.isLoading} error={entity.error}>
            {(target && targetFull && contact) && (
                <InputDeviceContactValue
                    contact={contact}
                    value={value}
                    onChange={handleChange}
                />
            )}
        </Loadable>
    );
};

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

const EntityContactSelection = (props: { target: IDeviceTargetIncomplete | undefined, contactAccess?: number, onSelected: (target: IDeviceTargetIncomplete | undefined) => void }) => {
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
                <ListItem selected={!target?.contactName || !target?.channelName} disablePadding>
                    <ListItemButton onClick={() => handleContactSelected({ deviceId: target!.deviceId })}>
                        <ListItemText>None</ListItemText>
                    </ListItemButton>
                </ListItem>
                {contacts.map(c => (
                    <ListItem selected={target?.channelName === c.channelName && target?.contactName === c.contactName} key={`${c.channelName}-${c.contactName}`} disablePadding>
                        <ListItemButton onClick={() => handleContactSelected(c)}>
                            <ListItemText>{c.contactName}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Loadable>
    );
};

interface EntitySelectionMenuProps {
    target?: IDeviceTargetIncomplete;
    selectContact?: boolean;
    contactAccessFilter?: number;
    selectValue?: boolean;
    value?: any;
    onSelected: (target: IDeviceTargetIncomplete | undefined, value: any) => void;
    onClose: () => void;
}

function EntitySelectionMenu(props: EntitySelectionMenuProps) {
    const {
        target, selectContact, contactAccessFilter, selectValue, value, onSelected, onClose
    } = props;
    const [selecting, setSelecting] = useState<undefined | 'entity' | 'contact' | 'value'>(undefined);
    const entitySelected = target?.deviceId;
    const contactSelected = !!(target?.channelName && target?.contactName);

    useEffect(() => {
        if (selectValue && target?.channelName && target?.contactName) {
            startTransition(() => {
                setSelecting('value');
            });
        } else if (selectContact && target?.deviceId) {
            startTransition(() => {
                setSelecting('contact');
            });
        } else {
            startTransition(() => {
                setSelecting('entity');
            });
        }
    }, [selectContact, selectValue, target]);

    console.log('selecting', selecting)

    const handleEditEntity = () => {
        startTransition(() => {
            setSelecting('entity');
        });
    };

    const handleEntitySelected = (target: IDeviceTargetIncomplete | undefined) => {
        onSelected(target, undefined);
        if (!selectContact && target?.deviceId) {
            onClose();
        }
    };

    const handleContactSelected = (target: IDeviceTargetIncomplete | undefined) => {
        onSelected(target, undefined);
        if (!selectValue && target?.channelName && target?.contactName) {
            onClose();
        }
    };

    const handleContactValueSelected = (newValue: any) => {
        onSelected(target, newValue);
        if (typeof newValue !== undefined) {
            onClose();
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Accordion expanded={selecting === 'entity'} sx={{ flexGrow: selecting === 'entity' ? 1 : 0 }} onChange={handleEditEntity} disableGutters TransitionProps={{ timeout: 150 }}>
                <AccordionSummary
                    expandIcon={!(selecting === 'entity') && <ChevronRightIcon />}>
                    {entitySelected ? (
                        <EntityIconLabel entityId={target.deviceId} />
                    ) : (
                        <Typography variant="body2" color="textSecondary">Select entity</Typography>
                    )}
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, overflow: 'auto' }}>
                    <EntitySelection target={target} onSelected={handleEntitySelected} />
                </AccordionDetails>
            </Accordion>
            {selectContact && (
                <Accordion disabled={!entitySelected} sx={{ flexGrow: selecting === 'contact' ? 1 : 0 }} expanded={selecting === 'contact'} disableGutters TransitionProps={{ timeout: 150 }}>
                    <AccordionSummary
                        expandIcon={!(selecting === 'contact') && <ChevronRightIcon />}>
                        <Stack spacing={2} direction="row" alignItems="center">
                            {contactSelected ? (
                                <Typography>{target.contactName}</Typography>
                            ) : (
                                <>
                                    {!entitySelected && (
                                        <>
                                            <Typography>Contact</Typography>
                                            <Typography variant="body2" color="textSecondary">Select entity first</Typography>
                                        </>
                                    )}
                                </>
                            )}
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                        <EntityContactSelection target={target!} contactAccess={contactAccessFilter} onSelected={handleContactSelected} />
                    </AccordionDetails>
                </Accordion>
            )}
            {selectValue && (
                <Accordion disabled={!contactSelected} sx={{ flexGrow: selecting === 'value' ? 1 : 0 }} expanded={selecting === 'value'} disableGutters TransitionProps={{ timeout: 150 }}>
                    <AccordionSummary
                        expandIcon={(!(selecting === 'value') && contactSelected) && <ChevronRightIcon />}>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Typography>Value</Typography>
                            {!contactSelected && <Typography variant="body2" color="textSecondary">Select contact first</Typography>}
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                        <EntityContactValueSelection target={target!} value={value} onSelected={handleContactValueSelected} />
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
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
    target?: IDeviceTargetIncomplete;
    selectContact?: boolean;
    contactAccessFilter?: number;
    selectValue?: boolean;
    value?: any;
    onChanged: (updated: IDeviceTargetIncomplete | undefined, value: any | undefined) => void;
}

function DisplayDeviceTarget(props: DisplayEntityTargetProps) {
    const {
        target,
        selectContact, contactAccessFilter,
        selectValue,
        value,
        onChanged
    } = props;
    const entityMenu = usePopupState({ variant: 'popover', popupId: 'entitytarget-menu' });

    const handleEntitySelected = (target: IDeviceTargetIncomplete | undefined, value: any) => {
        onChanged && onChanged(target, value);
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
                        selectContact={selectContact}
                        contactAccessFilter={contactAccessFilter}
                        selectValue={selectValue}
                        value={value}
                        onSelected={handleEntitySelected}
                        onClose={handleEntitySelectionClose} />
                </Box>
            </Popover>
        </>
    );
}

export default observer(DisplayDeviceTarget);

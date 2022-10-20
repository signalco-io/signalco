import React, { useEffect, useMemo, useState } from 'react';
import {
    bindPopover,
    bindTrigger,
    usePopupState
} from 'material-ui-popup-state/hooks';
import { Box, Stack } from '@mui/system';
import {
    Button,
    List,
    ListItem,
    ListItemButton,
    Sheet,
    TextField,
    Typography
} from '@mui/joy';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { PopperUnstyled } from '@mui/base';
import useContact from 'src/hooks/useContact';
import IEntityDetails from 'src/entity/IEntityDetails';
import IContactPointerPartial from 'src/contacts/IContactPointerPartial';
import InputContactValue from './InputContactValue';
import EntityIcon from './EntityIcon';
import Loadable from '../Loadable/Loadable';
import Accordion from '../layout/Accordion';
import NoDataPlaceholder from '../indicators/NoDataPlaceholder';
import useEntity from '../../../src/hooks/useEntity';
import useAllEntities from '../../../src/hooks/useAllEntities';

function EntityContactValueSelection(props: { target: IContactPointerPartial | undefined, value: any, onSelected: (value: any) => void }) {
    const { target, value, onSelected } = props;
    const entity = useEntity(target?.entityId);

    const targetFull = target && target.entityId && target.channelName && target.contactName
        ? { entityId: target.entityId, contactName: target.contactName, channelName: target.channelName }
        : undefined;
    const contact = useContact(targetFull);

    const handleChange = (newValue: any) => {
        onSelected(newValue);
    };

    return (
        <Loadable isLoading={entity.isLoading} error={entity.error}>
            {(target && targetFull && contact) && (
                <InputContactValue
                    contact={contact.data}
                    value={value}
                    onChange={handleChange}
                />
            )}
        </Loadable>
    );
}

function EntitySelection(props: { target: IContactPointerPartial | undefined, onSelected: (target: IContactPointerPartial | undefined) => void; }) {
    const {
        target, onSelected
    } = props;

    const entities = useAllEntities();
    const handleDeviceSelected = (selectedEntity: IEntityDetails | undefined) => {
        onSelected(selectedEntity ? { entityId: selectedEntity.id } : undefined);
    };

    const [searchTerm, setSearchTerm] = useState<string>('');
    const filteredEntities = useMemo(() => {
        return searchTerm
            ? entities.data?.filter(e => e.alias.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0)
            : entities.data;
    }, [searchTerm, entities.data]);

    return (
        <Loadable isLoading={entities.isLoading} error={entities.error}>
            <Stack spacing={1}>
                <Box px={2}>
                    <TextField fullWidth placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
                </Box>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => handleDeviceSelected(undefined)} selected={!target?.entityId}>
                            None
                        </ListItemButton>
                    </ListItem>
                    {filteredEntities?.map(entity => (
                        <ListItem key={entity.id}>
                            <ListItemButton onClick={() => handleDeviceSelected(entity)} selected={target?.entityId === entity.id}>
                                {entity.alias}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Loadable>
    );
}

interface EntityContactSelectionProps {
    target: IContactPointerPartial | undefined;
    onSelected: (target: IContactPointerPartial | undefined) => void;
}

function EntityContactSelection(props: EntityContactSelectionProps) {
    const {
        target, onSelected
    } = props;

    const { data: entity, isLoading, error } = useEntity(target?.entityId);
    const contacts = entity?.contacts ?? [];

    const handleContactSelected = (contact: IContactPointerPartial) => {
        onSelected(contact);
    }

    if (!isLoading && !error && !contacts.length) {
        return <Box sx={{ p: 2 }}><NoDataPlaceholder content={'No applicable contacts available'} /></Box>;
    }

    return (
        <Loadable isLoading={isLoading} error={error}>
            <List>
                <ListItem>
                    <ListItemButton onClick={() => handleContactSelected({ entityId: target!.entityId })} selected={!target?.contactName || !target?.channelName}>
                        None
                    </ListItemButton>
                </ListItem>
                {contacts.map(c => (
                    <ListItem key={`${c.channelName}-${c.contactName}`}>
                        <ListItemButton onClick={() => handleContactSelected(c)} selected={target?.channelName === c.channelName && target?.contactName === c.contactName}>
                            {c.contactName}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Loadable>
    );
}

interface EntitySelectionMenuProps {
    target?: IContactPointerPartial;
    selectContact?: boolean;
    selectValue?: boolean;
    value?: any;
    onSelected: (target: IContactPointerPartial | undefined, value: any) => void;
    onClose: () => void;
}

function EntitySelectionMenu(props: EntitySelectionMenuProps) {
    const {
        target, selectContact, selectValue, value, onSelected, onClose
    } = props;
    const [selecting, setSelecting] = useState<undefined | 'entity' | 'contact' | 'value'>(undefined);
    const entitySelected = target?.entityId;
    const contactSelected = !!(target?.channelName && target?.contactName);

    useEffect(() => {
        if (selectValue && target?.channelName && target?.contactName) {
            setSelecting('value');
        } else if (selectContact && target?.entityId) {
            setSelecting('contact');
        } else {
            setSelecting('entity');
        }
    }, [selectContact, selectValue, target]);

    console.log('selecting', selecting)

    const handleEditEntity = () => {
        setSelecting('entity');
    };

    const handleEntitySelected = (target: IContactPointerPartial | undefined) => {
        onSelected(target, undefined);
        if (!selectContact && target?.entityId) {
            onClose();
        }
    };

    const handleContactSelected = (target: IContactPointerPartial | undefined) => {
        onSelected(target, undefined);
        console.debug('contact selected', target);
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
            <Accordion
                open={selecting === 'entity'}
                sx={{ flexGrow: selecting === 'entity' ? 1 : 0 }}
                onChange={handleEditEntity}
            //expandIcon={!(selecting === 'entity') && <ChevronRightIcon />}
            >
                <Typography>
                    {entitySelected ? (
                        <EntityIconLabel entityId={target.entityId} />
                    ) : (
                        <Typography level="body2">Select entity</Typography>
                    )}
                </Typography>
                <Box sx={{ p: 0, overflow: 'auto' }}>
                    <EntitySelection target={target} onSelected={handleEntitySelected} />
                </Box>
            </Accordion>
            {selectContact && (
                <Accordion
                    disabled={!entitySelected}
                    sx={{ flexGrow: selecting === 'contact' ? 1 : 0 }}
                    open={selecting === 'contact'}
                //expandIcon={!(selecting === 'contact') && <ChevronRightIcon />}
                >
                    <Typography>
                        <Stack spacing={2} direction="row" alignItems="center">
                            {contactSelected ? (
                                <Typography>{target.contactName}</Typography>
                            ) : (
                                <>
                                    <Typography>Contact</Typography>
                                    {!entitySelected && (
                                        <>
                                            <Typography level="body2">Select entity first</Typography>
                                        </>
                                    )}
                                </>
                            )}
                        </Stack>
                    </Typography>
                    <EntityContactSelection target={target!} onSelected={handleContactSelected} />
                </Accordion>
            )}
            {selectValue && (
                <Accordion
                    disabled={!contactSelected}
                    sx={{ flexGrow: selecting === 'value' ? 1 : 0 }}
                    open={selecting === 'value'}
                //expandIcon={(!(selecting === 'value') && contactSelected) && <ChevronRightIcon />}
                >
                    <Typography>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Typography>Value</Typography>
                            {!contactSelected && <Typography level="body2">Select contact first</Typography>}
                        </Stack>
                    </Typography>
                    <EntityContactValueSelection target={target!} value={value} onSelected={handleContactValueSelected} />
                </Accordion>
            )}
        </Box>
    );
}


function EntityIconLabel(props: { entityId: string | undefined, description?: string }) {
    const { entityId, description } = props;
    const { data: entity, isLoading: loadingEntity } = useEntity(entityId);
    const isLoading = !!entityId && loadingEntity;

    const entityName = entity?.alias ?? (entity?.id);
    const Icon = EntityIcon(entity);

    return (
        <Stack spacing={2} direction="row" alignItems="center" minWidth={0}>
            {entity && <Icon />}
            <Stack alignItems="start" minWidth={0}>
                <Typography noWrap maxWidth="100%">
                    <Loadable isLoading={isLoading}>
                        {entityName}
                    </Loadable>
                </Typography>
                {!isLoading && (
                    <Typography level="body2">
                        {description}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
}

export interface DisplayEntityTargetProps {
    target?: IContactPointerPartial;
    selectContact?: boolean;
    selectValue?: boolean;
    value?: any;
    onChanged: (updated: IContactPointerPartial | undefined, value: any | undefined) => void;
}

function DisplayDeviceTarget(props: DisplayEntityTargetProps) {
    const {
        target,
        selectContact,
        selectValue,
        value,
        onChanged
    } = props;
    const entityMenu = usePopupState({ variant: 'popover', popupId: 'entitytarget-menu' });

    const handleEntitySelected = (target: IContactPointerPartial | undefined, value: any) => {
        onChanged && onChanged(target, value);
    };

    const handleEntitySelectionClose = () => {
        entityMenu.close();
    }

    let entityDescription = '';
    if (!target?.entityId) entityDescription = 'Select entity';

    return (
        <>
            <Button variant="outlined" fullWidth sx={{ minHeight: 56 }} {...bindTrigger(entityMenu)}>
                <Stack sx={{ width: '100%' }} spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                    <EntityIconLabel entityId={target?.entityId} description={entityDescription} />
                    <Stack spacing={1} direction="row" alignItems="center">
                        {(target && target.contactName && selectContact) && (
                            // <Chip label={target.contactName ?? 'None'} />
                            <Stack direction="row" spacing={1} alignItems="end">
                                <Typography level="body2">{target.contactName ?? 'None'}</Typography>
                                <Typography fontWeight="bold">{value?.toString() ?? '-'}</Typography>
                            </Stack>
                        )}
                        <ChevronRightIcon />
                    </Stack>
                </Stack>
            </Button>
            <ClickAwayListener onClickAway={(e) => {
                if (e.target !== entityMenu.anchorEl) {
                    entityMenu.close();
                }
            }}>
                <PopperUnstyled style={{ zIndex: 999999 }} {...bindPopover(entityMenu)}>
                    <Sheet sx={{ width: 420, height: 620 }}>
                        <EntitySelectionMenu
                            target={target}
                            selectContact={selectContact}
                            selectValue={selectValue}
                            value={value}
                            onSelected={handleEntitySelected}
                            onClose={handleEntitySelectionClose} />
                    </Sheet>
                </PopperUnstyled>
            </ClickAwayListener>
        </>
    );
}

export default DisplayDeviceTarget;

import React, { useEffect, useMemo, useState } from 'react';
import {
    bindTrigger,
    usePopupState
} from 'material-ui-popup-state/hooks';
import { Navigate } from '@signalco/ui-icons';
import {
    Accordion,
    Loadable,
    Popper,
    NoDataPlaceholder,
    Row,
    Button,
    Card,
    List,
    ListItem,
    ListItemButton,
    Stack,
    TextField,
    Typography,
    Box
} from '@signalco/ui';
import useEntity from '../../../src/hooks/signalco/useEntity';
import useContact from '../../../src/hooks/signalco/useContact';
import useAllEntities from '../../../src/hooks/signalco/useAllEntities';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import IContactPointer from '../../../src/contacts/IContactPointer';
import InputContactValue from './InputContactValue';
import EntityIcon from './EntityIcon';

function EntityContactValueSelection(props: { target: IContactPointer, valueSerialized: string | undefined, onSelected: (valueSerialized: string | undefined) => void }) {
    const { target, valueSerialized, onSelected } = props;
    const entity = useEntity(target?.entityId);

    const targetFull = target && target.entityId && target.channelName && target.contactName
        ? { entityId: target.entityId, contactName: target.contactName, channelName: target.channelName }
        : undefined;
    const contact = useContact(targetFull);

    return (
        <Loadable isLoading={entity.isLoading} error={entity.error}>
            {(target && targetFull && contact) && (
                <InputContactValue
                    contact={contact.data}
                    value={valueSerialized}
                    onChange={onSelected}
                />
            )}
        </Loadable>
    );
}

function EntitySelection(props: { target: Partial<IContactPointer> | undefined, onSelected: (target: Partial<IContactPointer> | undefined) => void; }) {
    const {
        target, onSelected
    } = props;

    const entities = useAllEntities();
    const handleEntitySelected = (selectedEntity: IEntityDetails | undefined) => {
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
                    <TextField autoFocus fullWidth placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
                </Box>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => handleEntitySelected(undefined)} selected={!target?.entityId}>
                            None
                        </ListItemButton>
                    </ListItem>
                    {filteredEntities?.map(entity => (
                        <ListItem key={entity.id}>
                            <ListItemButton onClick={() => handleEntitySelected(entity)} selected={target?.entityId === entity.id}>
                                {entity.alias}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Loadable>
    );
}

type ContactPointerRequiredEntity =
    (Partial<IContactPointer> & Pick<IContactPointer, 'entityId'>)
    | IContactPointer;

interface EntityContactSelectionProps {
    target: ContactPointerRequiredEntity;
    onSelected: (target: ContactPointerRequiredEntity) => void;
}

function EntityContactSelection(props: EntityContactSelectionProps) {
    const {
        target, onSelected
    } = props;

    const { data: entity, isLoading, error } = useEntity(target?.entityId);
    const contacts = entity?.contacts ?? [];

    const handleContactSelected = (contact: ContactPointerRequiredEntity) => {
        onSelected(contact);
    }

    if (!isLoading && !error && !contacts.length) {
        return <Box sx={{ p: 2 }}><NoDataPlaceholder content={'No applicable contacts available'} /></Box>;
    }

    return (
        <Loadable isLoading={isLoading} error={error}>
            <List>
                <ListItem>
                    <ListItemButton onClick={() => handleContactSelected({ entityId: target.entityId })} selected={!target.contactName || !target.channelName}>
                        None
                    </ListItemButton>
                </ListItem>
                {contacts.map(c => (
                    <ListItem key={`${c.channelName}-${c.contactName}`}>
                        <ListItemButton onClick={() => handleContactSelected(c)} selected={target.channelName === c.channelName && target.contactName === c.contactName}>
                            {c.contactName}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Loadable>
    );
}

interface EntitySelectionMenuProps {
    target?: Partial<IContactPointer>;
    selectContact?: boolean;
    selectValue?: boolean;
    valueSerialized?: string | undefined;
    onSelected: (target: Partial<IContactPointer> | undefined, valueSerialized: string | undefined) => void;
    onClose: () => void;
}

function EntitySelectionMenu({
    target, selectContact, selectValue, valueSerialized,
    onSelected, onClose
}: EntitySelectionMenuProps) {
    const [selecting, setSelecting] = useState<'entity' | 'contact' | 'value'>(
        (selectValue && target?.contactName)
            ? 'value'
            : (selectContact && target?.entityId
                ? 'contact'
                : 'entity'));
    const entitySelected = target?.entityId;
    const contactSelected = !!(entitySelected && target?.channelName && target?.contactName);

    useEffect(() => {
        if (selectValue && contactSelected) {
            setSelecting('value');
        } else if (selectContact && entitySelected) {
            setSelecting('contact');
        } else {
            setSelecting('entity');
        }
    }, [contactSelected, entitySelected, selectContact, selectValue]);

    const handleEditEntity = () => {
        setSelecting('entity');
    };

    const handleEntitySelected = (target: Partial<IContactPointer> | undefined) => {
        onSelected(target, undefined);
        if (!selectContact && target?.entityId) {
            onClose();
        }
    };

    const handleContactSelected = (target: Partial<IContactPointer> | undefined) => {
        onSelected(target, undefined);
        if (!selectValue && target?.channelName && target?.contactName) {
            onClose();
        }
    };

    const handleContactValueSelected = (newValueSerialized: string | undefined) => {
        onSelected(target, newValueSerialized);
        if (typeof newValueSerialized !== undefined) {
            onClose();
        }
    };

    return (
        <>
            <Accordion
                open={selecting === 'entity'}
                sx={{ flexGrow: selecting === 'entity' ? 1 : 0 }}
                onChange={handleEditEntity}
                unmountOnExit
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
            {(selectContact && entitySelected) && (
                <Accordion
                    sx={{ flexGrow: selecting === 'contact' ? 1 : 0 }}
                    open={selecting === 'contact'}
                    disabled={selecting !== 'contact' && !entitySelected}
                    unmountOnExit
                >
                    <Typography>
                        <Row spacing={2}>
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
                        </Row>
                    </Typography>
                    <EntityContactSelection target={target as ContactPointerRequiredEntity} onSelected={handleContactSelected} />
                </Accordion>
            )}
            {(selectValue && contactSelected) && (
                <Accordion
                    sx={{ flexGrow: selecting === 'value' ? 1 : 0 }}
                    open={selecting === 'value'}
                    disabled={selecting !== 'value' && !contactSelected}
                    unmountOnExit
                >
                    <Typography>
                        <Row spacing={2}>
                            <Typography>Value</Typography>
                            {!contactSelected && <Typography level="body2">Select contact first</Typography>}
                        </Row>
                    </Typography>
                    <EntityContactValueSelection target={target as IContactPointer} valueSerialized={valueSerialized} onSelected={handleContactValueSelected} />
                </Accordion>
            )}
        </>
    );
}


function EntityIconLabel(props: { entityId: string | undefined, description?: string }) {
    const { entityId, description } = props;
    const { data: entity, isLoading: loadingEntity } = useEntity(entityId);
    const isLoading = !!entityId && loadingEntity;

    const entityName = entity?.alias ?? (entity?.id);
    const Icon = EntityIcon(entity);

    return (
        <Row spacing={2} style={{ minWidth: 0 }}>
            {entity && <Icon />}
            <Stack alignItems="start" style={{ minWidth: 0 }}>
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
        </Row>
    );
}

export interface DisplayEntityTargetProps {
    target?: Partial<IContactPointer>;
    selectContact?: boolean;
    selectValue?: boolean;
    valueSerialized?: string | undefined;
    onChanged?: (updated: Partial<IContactPointer> | undefined, valueSerialized: string | undefined) => void;
}

function DisplayEntityTarget(props: DisplayEntityTargetProps) {
    const {
        target,
        selectContact,
        selectValue,
        valueSerialized,
        onChanged
    } = props;
    const entityMenu = usePopupState({ variant: 'popover', popupId: 'entitytarget-menu' });

    const handleEntitySelected = (target: Partial<IContactPointer> | undefined, valueSerialized: string | undefined) => {
        onChanged && onChanged(target, valueSerialized);
    };

    const handleEntitySelectionClose = () => {
        entityMenu.close();
    }

    let entityDescription = '';
    if (!target?.entityId) entityDescription = 'Select entity';

    return (
        <>
            <Button variant="outlined" fullWidth sx={{ minHeight: 56 }} {...bindTrigger(entityMenu)}>
                <Row style={{ width: '100%' }} spacing={2} justifyContent="space-between">
                    <EntityIconLabel entityId={target?.entityId} description={entityDescription} />
                    <Row spacing={1}>
                        {(target && target.contactName && selectContact) && (
                            <Row spacing={1} alignItems="end">
                                <Typography level="body2">{target.contactName ?? 'None'}</Typography>
                                {selectValue && (
                                    <Typography fontWeight="bold">{valueSerialized ?? '-'}</Typography>
                                )}
                            </Row>
                        )}
                        <Navigate />
                    </Row>
                </Row>
            </Button>
            <Popper popupState={entityMenu}>
                <Card sx={{ width: 420, minHeight: 320, maxHeight: 320 }}>
                    <EntitySelectionMenu
                        target={target}
                        selectContact={selectContact}
                        selectValue={selectValue}
                        valueSerialized={valueSerialized}
                        onSelected={handleEntitySelected}
                        onClose={handleEntitySelectionClose} />
                </Card>
            </Popper>
        </>
    );
}

export default DisplayEntityTarget;

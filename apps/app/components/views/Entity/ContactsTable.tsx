import React, { Fragment, useMemo, useState } from 'react';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { bindTrigger } from 'material-ui-popup-state';
import { Add, Code, Delete, Edit, MoreVertical, UI } from '@signalco/ui-icons';
import { ParsedJson } from '@signalco/ui/dist/sharedTypes';
import { Stack, Loadable, Row, Button, Card, IconButton, List, ListDivider, ListItem, Menu, MenuItem, TextField, Tooltip, Typography, Box, CopyToClipboardInput, ListTreeItem, Picker, Timeago, ListItemDecorator } from '@signalco/ui';
import { camelToSentenceCase } from '@signalco/js';
import ConfirmDeleteDialog from '../../shared/dialog/ConfirmDeleteDialog';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import CodeEditor from '../../code/CodeEditor';
import ChannelLogo from '../../channels/ChannelLogo';
import useLocale from '../../../src/hooks/useLocale';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { deleteContactAsync, setAsync } from '../../../src/contacts/ContactRepository';

function JsonNonArrayVisualizer({ value }: { value: ParsedJson }) {
    if (value === null ||
        typeof (value) === 'undefined') {
        return <div>null</div>
    }

    if (typeof value === 'object') {
        const propertyNames = Object.keys(value);
        const properties = typeof value !== 'undefined' && propertyNames
            ? propertyNames.map(pn => ({ name: pn, value: value == null ? value[pn] : null }))
            : [];

        return (
            <div>
                {properties && properties.map(prop =>
                    <ObjectVisualizer key={prop.name} name={prop.name} value={prop.value} />)}
            </div>
        );
    }

    return null;
}
function JsonArrayVisualizer(props: { name: string, value: Array<ParsedJson> }) {
    return (
        <>
            {props.value.map((v, i) => <ObjectVisualizer key={`${props.name}-${i}`} defaultOpen={props.value.length <= 1} name={i.toString()} value={v} />)}
        </>
    );
}

function ObjectVisualizer(props: { name: string, value: ParsedJson, defaultOpen?: boolean }) {
    const { name, value, defaultOpen } = props;
    const isArray = Array.isArray(value);
    const hasChildren = typeof value === 'object' || isArray;

    return (
        <ListTreeItem
            nodeId={name}
            defaultOpen={defaultOpen}
            label={(
                <Row spacing={1}>
                    {name && (
                        <Tooltip title={`${name} (${(isArray ? `array[${value.length}]` : typeof value)})`}>
                            <Typography
                                minWidth={120}>
                                {name}
                            </Typography>
                        </Tooltip>
                    )}
                    {!hasChildren && (
                        // TODO: Implement visualizer for different data types
                        //     - number
                        //     - color (hex)
                        //     - URL
                        //     - GUID/UUID
                        //     - boolean
                        //     - ability to unset value
                        <CopyToClipboardInput size="sm" variant="outlined" value={value?.toString()} />
                    )}
                </Row>
            )}>
            {hasChildren && (
                <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', ml: 2.5 }}>
                    {isArray
                        ? <JsonArrayVisualizer name={name} value={value as Array<ParsedJson>} />
                        : <JsonNonArrayVisualizer value={value} />}
                </Box>
            )}
        </ListTreeItem>
    );
}

function DisplayJson(props: { json: string | undefined }) {
    const [showSource, setShowSource] = useState(false);
    const jsonObj = useMemo(() => JSON.parse(props.json ?? ''), [props.json]);
    const jsonFormatted = useMemo(() => JSON.stringify(jsonObj, undefined, 4), [jsonObj]);

    return (
        <div style={{ position: 'relative', minWidth: '230px' }}>
            {showSource ? (
                <CodeEditor language="json" code={jsonFormatted} height={300} />
            ) : (
                <List size="sm">
                    <ObjectVisualizer name="root" defaultOpen value={jsonObj} />
                </List>
            )}
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
                <Picker value={showSource ? 'source' : 'ui'} size="sm" onChange={(_, s) => setShowSource(s === 'source')} options={[
                    { value: 'ui', label: <UI size={18} /> },
                    { value: 'source', label: <Code size={18} /> }
                ]} />
            </div>
        </div>
    );
}

function isJson(value: string | undefined) {
    try {
        if (typeof value === 'string' &&
            value[0] === '{' &&
            typeof JSON.parse(value) !== 'undefined')
            return true;
        return false;
    } catch {
        return false;
    }
}

export default function ContactsTable(props: { entity: IEntityDetails | undefined; }) {
    const { entity } = props;
    const { t } = useLocale('App', 'Entities');

    const isLoading = false;
    const error = undefined;

    const createContactDialogState = usePopupState({ variant: 'dialog', popupId: 'contactCreateDialog' });
    const editContactValueDialogState = usePopupState({ variant: 'dialog', popupId: 'contactEditValueDialog' });
    const deleteContactDialogState = usePopupState({ variant: 'dialog', popupId: 'contactDeleteDialog' });
    const [channelName, setChannelName] = useState('');
    const [contactName, setContactName] = useState('');
    const [editingContact, setEditingContact] = useState<IContactPointer | undefined>(undefined);
    const [deletingContact, setDeletingContact] = useState<IContactPointer | undefined>(undefined);
    const [valueSerialized, setValueSerialized] = useState('');

    const handleCreateSubmit = async () => {
        if (entity) {
            await setAsync({
                entityId: entity.id,
                channelName,
                contactName
            }, undefined);
        }
        createContactDialogState.close();
    };
    const handleEditValueSubmit = async () => {
        if (entity) {
            if (!editingContact)
                throw new Error('Requested contact not found');

            await setAsync({
                entityId: entity.id,
                channelName: editingContact.channelName,
                contactName: editingContact.contactName
            }, valueSerialized);
        }
        editContactValueDialogState.close();
    };
    const handleDeleteContact = async () => {
        if (entity) {
            if (!deletingContact)
                throw new Error('Requested contact not found');

            await deleteContactAsync({
                entityId: entity.id,
                channelName: deletingContact.channelName,
                contactName: deletingContact.contactName
            });
        }
        deleteContactDialogState.close();
    }

    return (
        <>
            <Card>
                <Row justifyContent="space-between">
                    <Typography>{t('Contacts')}</Typography>
                    <Menu menuId="contacts-options" renderTrigger={(props) => (
                        <IconButton size="sm" {...props}>
                            <MoreVertical />
                        </IconButton>
                    )}>
                        <MenuItem {...bindTrigger(createContactDialogState)} startDecorator={<Add />}>
                            {t('CreateContact')}
                        </MenuItem>
                    </Menu>
                </Row>
                <Loadable isLoading={isLoading} error={error}>
                    <List>
                        {entity?.contacts?.map((c, i) => (
                            <Fragment key={`${c.entityId}-${c.channelName}-${c.contactName}`}>
                                <ListItem endAction={(
                                    <Menu renderTrigger={(props) => (
                                        <IconButton size="sm" {...props}>
                                            <MoreVertical />
                                        </IconButton>
                                    )}>
                                        <MenuItem
                                            {...bindTrigger(editContactValueDialogState)}
                                            onClick={(e) => {
                                                setEditingContact(c);
                                                editContactValueDialogState.open(e);
                                            }}
                                            startDecorator={<Edit />}>
                                            {t('EditContact')}
                                        </MenuItem>
                                        <MenuItem
                                            {...bindTrigger(deleteContactDialogState)}
                                            onClick={(e) => {
                                                setDeletingContact(c);
                                                deleteContactDialogState.open(e);
                                            }}
                                            startDecorator={<Delete />}>
                                            {t('DeleteContact')}
                                        </MenuItem>
                                    </Menu>
                                )}>
                                    <ListItemDecorator>
                                        <ChannelLogo channelName={c.channelName} size="tiny" label={c.channelName} />
                                    </ListItemDecorator>
                                    <Row spacing={1} style={{ flexGrow: 1 }}>
                                        <Typography noWrap style={{ width: '30%', maxWidth: '200px' }}>{camelToSentenceCase(c.contactName)}</Typography>
                                        <Stack style={{ flexGrow: 1 }}>
                                            {isJson(c.valueSerialized)
                                                ? <DisplayJson json={c.valueSerialized} />
                                                : <Typography>{c.valueSerialized}</Typography>}
                                            <div style={{ fontSize: 'var(--joy-fontSize-xs)', color: 'var(--joy-palette-text-tertiary)' }}>
                                                <Timeago date={c.timeStamp} live />
                                            </div>
                                        </Stack>
                                    </Row>
                                </ListItem>
                                {i < (entity?.contacts?.length ?? 0) - 1 && <ListDivider />}
                            </Fragment>
                        ))}
                    </List>
                </Loadable>
            </Card>
            <ConfigurationDialog
                isOpen={createContactDialogState.isOpen}
                header="Create contact"
                onClose={createContactDialogState.close}>
                <Stack spacing={1}>
                    <TextField value={channelName} onChange={(e) => setChannelName(e.target.value)} />
                    <TextField value={contactName} onChange={(e) => setContactName(e.target.value)} />
                    <Button onClick={handleCreateSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
            <ConfigurationDialog
                isOpen={editContactValueDialogState.isOpen}
                header="Edit contact"
                onClose={editContactValueDialogState.close}>
                <Stack spacing={1}>
                    <TextField value={valueSerialized} onChange={(e) => setValueSerialized(e.target.value)} />
                    <Button onClick={handleEditValueSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
            <ConfirmDeleteDialog
                isOpen={deleteContactDialogState.isOpen}
                header="Delete contact"
                expectedConfirmText={`${deletingContact?.channelName}-${deletingContact?.contactName}`}
                onClose={deleteContactDialogState.close}
                onConfirm={handleDeleteContact} />
        </>
    );
}

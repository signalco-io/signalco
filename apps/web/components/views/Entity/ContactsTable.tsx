import React, { Fragment, useMemo, useState } from 'react';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Add, Code, MoreVertical, UI } from '@signalco/ui-icons';
import { Box, Stack } from '@mui/system';
import { Button, Card, IconButton, List, ListDivider, ListItem, ListItemContent, ListItemDecorator, Menu, MenuItem, TextField, Typography } from '@mui/joy';
import Loadable from 'components/shared/Loadable/Loadable';
import ListTreeItem from 'components/shared/list/ListTreeItem';
import Picker from 'components/shared/form/Picker';
import CopyToClipboardInput from 'components/shared/form/CopyToClipboardInput';
import CodeEditor from 'components/code/CodeEditor';
import SelectItems from '../../shared/form/SelectItems';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import useLocale from '../../../src/hooks/useLocale';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import { setAsync } from '../../../src/contacts/ContactRepository';
import Timeago from '../../../components/shared/time/Timeago';

function JsonNonArrayVisualizer(props: { name: string, value: any }) {
    if (props.value === null ||
        typeof (props.value) === 'undefined') {
        return <div>null</div>
    }

    if (typeof props.value === 'object') {
        const propertyNames = Object.keys(props.value);
        const properties = typeof props.value !== 'undefined' && propertyNames
            ? propertyNames.map(pn => ({ name: pn, value: props.value[pn] }))
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
function JsonArrayVisualizer(props: { name: string, value: Array<any> }) {
    return (
        <>
            {props.value.map((v, i) => <ObjectVisualizer key={`${props.name}-${i}`} defaultOpen={props.value.length <= 1} name={i.toString()} value={v} />)}
        </>
    );
}

function ObjectVisualizer(props: { name: string, value: any, defaultOpen?: boolean }) {
    const { name, value, defaultOpen } = props;
    const isArray = Array.isArray(value);
    const hasChildren = typeof value === 'object' || isArray;

    return (
        <ListTreeItem
            nodeId={name}
            defaultOpen={defaultOpen}
            label={(
                <Stack spacing={1} direction="row" alignItems="center">
                    {name && (
                        <Typography
                            minWidth={120}
                            title={`${name} (${(isArray ? `array[${value.length}]` : typeof value)})`}>
                            {name}
                        </Typography>
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
                </Stack>
            )}>
            {hasChildren && (
                <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', ml: 2.5 }}>
                    {isArray
                        ? <JsonArrayVisualizer name={name} value={value as Array<any>} />
                        : <JsonNonArrayVisualizer name={name} value={value} />}
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
        <Box sx={{ position: 'relative', minWidth: '230px' }}>
            {showSource ? (
                <CodeEditor language="json" code={jsonFormatted} height={300} />
            ) : (
                <List size="sm">
                    <ObjectVisualizer name="root" defaultOpen value={jsonObj} />
                </List>
            )}
            <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                <Picker value={showSource ? 'source' : 'ui'} size="sm" onChange={(_, s) => setShowSource(s === 'source')} options={[
                    { value: 'ui', label: <UI size={18} /> },
                    { value: 'source', label: <Code size={18} /> }
                ]} />
            </Box>
        </Box>
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

    const popupState = usePopupState({ variant: 'popover', popupId: 'contactsMenu' });
    const createContactDialogState = usePopupState({ variant: 'dialog', popupId: 'contactCreateDialog' });
    const editContactValueDialogState = usePopupState({ variant: 'dialog', popupId: 'contactCreateDialog' });
    const [channelName, setChannelName] = useState('');
    const [contactName, setContactName] = useState('');
    const [editingContact, setEditingContact] = useState('');
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
            await setAsync({
                entityId: entity.id,
                channelName: entity.contacts.find(c => c.contactName === editingContact)?.channelName ?? '',
                contactName: editingContact
            }, valueSerialized);
        }
        editContactValueDialogState.close();
    };

    return (
        <>
            <Card>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>{t('Contacts')}</Typography>
                    <IconButton size="sm" {...bindTrigger(popupState)}>
                        <MoreVertical />
                    </IconButton>
                </Stack>
                <Loadable isLoading={isLoading} error={error}>
                    <List>
                        {entity?.contacts?.map((c, i) => (
                            <Fragment key={`${c.entityId}-${c.channelName}-${c.contactName}`}>
                                <ListItem>
                                    <ListItemContent>
                                        <Stack spacing={1} direction="row" alignItems="center">
                                            <Stack sx={{ width: '30%', maxWidth: '260px' }}>
                                                <Typography noWrap>{c.contactName}</Typography>
                                                <Typography noWrap level="body3">{c.channelName}</Typography>
                                            </Stack>
                                            <Stack flexGrow={1}>
                                                {isJson(c.valueSerialized)
                                                    ? <DisplayJson json={c.valueSerialized} />
                                                    : <Typography>{c.valueSerialized}</Typography>}
                                                <Box sx={{ fontSize: 'var(--joy-fontSize-xs)', color: 'var(--joy-palette-text-tertiary)' }}>
                                                    <Timeago date={c.timeStamp} live />
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </ListItemContent>
                                </ListItem>
                                {i < (entity?.contacts?.length ?? 0) - 1 && <ListDivider />}
                            </Fragment>
                        ))}
                    </List>
                </Loadable>
            </Card>
            <Menu {...bindMenu(popupState)}>
                <MenuItem {...bindTrigger(createContactDialogState)}>
                    <ListItemDecorator>
                        <Add />
                    </ListItemDecorator>
                    {t('CreateContact')}
                </MenuItem>
                <MenuItem {...bindTrigger(editContactValueDialogState)}>
                    <ListItemDecorator>
                        <Add />
                    </ListItemDecorator>
                    {t('EditContact')}
                </MenuItem>
            </Menu>
            <ConfigurationDialog
                isOpen={createContactDialogState.isOpen}
                title="Create contact"
                onClose={createContactDialogState.close}>
                <Stack spacing={1}>
                    <TextField value={channelName} onChange={(e) => setChannelName(e.target.value)} />
                    <TextField value={contactName} onChange={(e) => setContactName(e.target.value)} />
                    <Button onClick={handleCreateSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
            <ConfigurationDialog
                isOpen={editContactValueDialogState.isOpen}
                title="Create contact"
                onClose={editContactValueDialogState.close}>
                <Stack spacing={1}>
                    <SelectItems
                        items={entity?.contacts?.map(c => ({ value: c.contactName, label: c.contactName })) ?? []}
                        value={editingContact ? [editingContact] : []}
                        onChange={(values) => setEditingContact(values[0])} />
                    <TextField value={valueSerialized} onChange={(e) => setValueSerialized(e.target.value)} />
                    <Button onClick={handleEditValueSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
        </>
    );
}

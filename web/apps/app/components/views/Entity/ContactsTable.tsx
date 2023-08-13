import React, { useMemo, useState } from 'react';
import { Add, Code, Delete, Edit, MoreVertical, UI, History } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Tooltip } from '@signalco/ui/dist/Tooltip';
import { Timeago } from '@signalco/ui/dist/Timeago';
import { Stack } from '@signalco/ui/dist/Stack';
import { SelectItems } from '@signalco/ui/dist/SelectItems';
import { Row } from '@signalco/ui/dist/Row';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui/dist/Menu';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { ListTreeItem } from '@signalco/ui/dist/ListTreeItem';
import { ListItem } from '@signalco/ui/dist/ListItem';
import { List } from '@signalco/ui/dist/List';
import { Input } from '@signalco/ui/dist/Input';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { CopyToClipboardInput } from '@signalco/ui/dist/CopyToClipboardInput';
import { Card } from '@signalco/ui/dist/Card';
import { Button } from '@signalco/ui/dist/Button';
import { camelToSentenceCase, isJson, ParsedJson } from '@signalco/js';
import ConfirmDeleteDialog from '../../shared/dialog/ConfirmDeleteDialog';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import CodeEditor from '../../code/CodeEditor';
import ChannelLogo from '../../channels/ChannelLogo';
import useLocale from '../../../src/hooks/useLocale';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import IContactPointer from '../../../src/contacts/IContactPointer';
import IContact, { ContactMetadataV1 } from '../../../src/contacts/IContact';
import { deleteContactAsync, setAsync, setMetadataAsync } from '../../../src/contacts/ContactRepository';
import { Chip } from '@signalco/ui/dist/Chip';

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
                        <div className="min-w-[120px]">
                            <Tooltip title={`${name} (${(isArray ? `array[${value.length}]` : typeof value)})`}>
                                <Typography>
                                    {name}
                                </Typography>
                            </Tooltip>
                        </div>
                    )}
                    {!hasChildren && (
                        // TODO: Implement visualizer for different data types
                        //     - number
                        //     - color (hex)
                        //     - URL
                        //     - GUID/UUID
                        //     - boolean
                        //     - ability to unset value
                        <CopyToClipboardInput defaultValue={value?.toString()} />
                    )}
                </Row>
            )}>
            {hasChildren && (
                <div className="ml-2">
                    {isArray
                        ? <JsonArrayVisualizer name={name} value={value as Array<ParsedJson>} />
                        : <JsonNonArrayVisualizer value={value} />}
                </div>
            )}
        </ListTreeItem>
    );
}

function DisplayJson(props: { json: string | undefined }) {
    const [showSource, setShowSource] = useState(false);
    const jsonObj = useMemo(() => JSON.parse(props.json ?? '') as ParsedJson, [props.json]);
    const jsonFormatted = useMemo(() => JSON.stringify(jsonObj, undefined, 4), [jsonObj]);

    const selectItems = useMemo(() => [
        { value: 'ui', label: <UI size={18} /> },
        { value: 'source', label: <Code size={18} /> }
    ], []);

    return (
        <div className="relative min-w-[230px]">
            {showSource ? (
                <CodeEditor language="json" code={jsonFormatted} height={300} />
            ) : (
                <List>
                    <ObjectVisualizer name="root" defaultOpen value={jsonObj} />
                </List>
            )}
            <div className="absolute right-0 top-0">
                <SelectItems
                    value={showSource ? 'source' : 'ui'}
                    onValueChange={value => setShowSource(value === 'source')}
                    items={selectItems} />
            </div>
        </div>
    );
}

export default function ContactsTable({ entity }: { entity: IEntityDetails | null | undefined; }) {
    const { t } = useLocale('App', 'Entities');

    const isLoading = false;
    const error = undefined;

    const [createContactDialogOpen, setCreateContactDialogOpen] = useState(false);
    const [editingContactDialogOpen, setEditingContactDialogOpen] = useState(false);
    const [deletingContactDialogOpen, setDeletingContactDialogOpen] = useState(false);
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
        setCreateContactDialogOpen(false);
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
        setEditingContactDialogOpen(false);
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
        setDeletingContactDialogOpen(false);
    }

    const handleToggleContactHistory = async (contact: IContact) => {
        if (entity && contact) {
            await setMetadataAsync({
                entityId: entity.id,
                channelName: contact.channelName,
                contactName: contact.contactName
            }, JSON.stringify({
                ...contact.metadata,
                Version: contact.metadata?.Version ?? 1,
                PersistHistory: !contact.metadata?.PersistHistory
            } satisfies ContactMetadataV1))
        }
    };

    const handleToggleContactProcessSameValue = async (contact: IContact) => {
        if (entity && contact) {
            await setMetadataAsync({
                entityId: entity.id,
                channelName: contact.channelName,
                contactName: contact.contactName
            }, JSON.stringify({
                ...contact.metadata,
                Version: contact.metadata?.Version ?? 1,
                ProcessSameValue: !contact.metadata?.ProcessSameValue
            } satisfies ContactMetadataV1))
        }
    };

    return (
        <>
            <Card>
                <Row justifyContent="space-between">
                    <Typography>{t('Contacts')}</Typography>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <IconButton size="sm">
                                <MoreVertical />
                            </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => setCreateContactDialogOpen(true)} startDecorator={<Add />}>
                                {t('CreateContact')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Row>
                <Loadable isLoading={isLoading} loadingLabel="Loading contacts" error={error}>
                    <List>
                        {entity?.contacts?.map(c => (
                            <ListItem
                                key={`${c.entityId}-${c.channelName}-${c.contactName}`}
                                startDecorator={(
                                    <ChannelLogo channelName={c.channelName} size="tiny" label={c.channelName} />
                                )}
                                endDecorator={(
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <IconButton size="sm">
                                                <MoreVertical />
                                            </IconButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    handleToggleContactHistory(c);
                                                }}
                                                startDecorator={<History />}
                                            >
                                                {t(c.metadata?.PersistHistory ? 'ContactDisablePersistHistory' : 'ContactEnablePersistHistory')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    handleToggleContactProcessSameValue(c);
                                                }}
                                                startDecorator={<History />}
                                            >
                                                {t(c.metadata?.ProcessSameValue ? 'ContactDisableProcessSameValue' : 'ContactEnableProcessSameValye')}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setEditingContactDialogOpen(true);
                                                    setEditingContact(c);
                                                }}
                                                startDecorator={<Edit />}>
                                                {t('EditContact')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setDeletingContactDialogOpen(true);
                                                    setDeletingContact(c);
                                                }}
                                                startDecorator={<Delete />}>
                                                {t('DeleteContact')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                label={(
                                    <Row spacing={1} className="grow">
                                        <div className="w-1/3 max-w-[200px]">
                                            <Typography noWrap>{camelToSentenceCase(c.contactName)}</Typography>
                                        </div>
                                        <Stack style={{ flexGrow: 1 }}>
                                            {isJson(c.valueSerialized)
                                                ? <DisplayJson json={c.valueSerialized} />
                                                : <Typography>{c.valueSerialized}</Typography>}
                                            <Row spacing={1}>
                                                <div className="text-xs text-muted-foreground">
                                                    <Timeago date={c.timeStamp} live />
                                                </div>
                                                {c.metadata?.PersistHistory && (
                                                    <Chip startDecorator={<History size={14} />} size="sm">History</Chip>
                                                )}
                                                {c.metadata?.ProcessSameValue && (
                                                    <Chip size="sm">Process same value</Chip>
                                                )}
                                            </Row>
                                        </Stack>
                                    </Row>
                                )} />
                        ))}
                    </List>
                </Loadable>
            </Card>
            <ConfigurationDialog
                open={createContactDialogOpen}
                header="Create contact"
                onClose={() => setCreateContactDialogOpen(false)}>
                <Stack spacing={1}>
                    <Input value={channelName} onChange={(e) => setChannelName(e.target.value)} />
                    <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
                    <Button onClick={handleCreateSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
            <ConfigurationDialog
                open={editingContactDialogOpen}
                header="Edit contact"
                onClose={() => setEditingContactDialogOpen(false)}>
                <Stack spacing={1}>
                    <Input value={valueSerialized} onChange={(e) => setValueSerialized(e.target.value)} />
                    <Button onClick={handleEditValueSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
            <ConfirmDeleteDialog
                isOpen={deletingContactDialogOpen}
                header="Delete contact"
                expectedConfirmText={`${deletingContact?.channelName}-${deletingContact?.contactName}`}
                onClose={() => setDeletingContactDialogOpen(false)}
                onConfirm={handleDeleteContact} />
        </>
    );
}

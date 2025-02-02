import React, { useMemo, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Table } from '@signalco/ui-primitives/Table';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Row } from '@signalco/ui-primitives/Row';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { List } from '@signalco/ui-primitives/List';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Chip } from '@signalco/ui-primitives/Chip';
import { Card } from '@signalco/ui-primitives/Card';
import { Button } from '@signalco/ui-primitives/Button';
import { Add, Code, Delete, Edit, UI, History, CircleEqual, MoreHorizontal } from '@signalco/ui-icons';
import { Timeago } from '@signalco/ui/Timeago';
import { Loadable } from '@signalco/ui/Loadable';
import { camelToSentenceCase, isJson, ParsedJson } from '@signalco/js';
import { ObjectVisualizer } from '../../visualizers/ObjectVisualizer';
import ConfirmDeleteDialog from '../../shared/dialog/ConfirmDeleteDialog';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import CodeEditor from '../../code/CodeEditor';
import ChannelLogo from '../../channels/ChannelLogo';
import useLocale from '../../../src/hooks/useLocale';
import useSetMetadataContact from '../../../src/hooks/signalco/useSetMetadataContact';
import useSetContact from '../../../src/hooks/signalco/useSetContact';
import useDeleteContact from '../../../src/hooks/signalco/useDeleteContact';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import IContactPointer from '../../../src/contacts/IContactPointer';
import IContact, { ContactMetadataV1 } from '../../../src/contacts/IContact';

type DisplayJsonProps = {
    json: string | undefined;
    className?: string;
};

function DisplayJson({ json, className }: DisplayJsonProps) {
    const [showSource, setShowSource] = useState(false);
    const jsonObj = useMemo(() => JSON.parse(json ?? '') as ParsedJson, [json]);
    const jsonFormatted = useMemo(() => JSON.stringify(jsonObj, undefined, 4), [jsonObj]);

    const selectItems = useMemo(() => [
        { value: 'ui', label: <UI size={18} /> },
        { value: 'source', label: <Code size={18} /> }
    ], []);

    return (
        <div className={cx('relative min-w-[230px]', className)}>
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
    const deleteContact = useDeleteContact();
    const setContact = useSetContact();
    const setMetadataContact = useSetMetadataContact();

    const handleCreateSubmit = async () => {
        if (entity) {
            await setContact.mutateAsync({
                pointer: {
                    entityId: entity.id,
                    channelName,
                    contactName
                },
                valueSerialized: undefined
            });
        }
        setCreateContactDialogOpen(false);
    };
    const handleEditValueSubmit = async () => {
        if (entity) {
            if (!editingContact)
                throw new Error('Requested contact not found');

            await setContact.mutateAsync({
                pointer: {
                    entityId: entity.id,
                    channelName: editingContact.channelName,
                    contactName: editingContact.contactName
                },
                valueSerialized
            });
        }
        setEditingContactDialogOpen(false);
    };
    const handleDeleteContact = async () => {
        if (entity) {
            if (!deletingContact)
                throw new Error('Requested contact not found');

            await deleteContact.mutateAsync({
                entityId: entity.id,
                channelName: deletingContact.channelName,
                contactName: deletingContact.contactName
            });
        }
        setDeletingContactDialogOpen(false);
    }

    const handleToggleContactHistory = async (contact: IContact) => {
        if (entity && contact) {
            await setMetadataContact.mutateAsync({
                pointer: {
                    entityId: entity.id,
                    channelName: contact.channelName,
                    contactName: contact.contactName
                },
                metadataSerialized: JSON.stringify({
                    ...contact.metadata,
                    Version: contact.metadata?.Version ?? 1,
                    PersistHistory: !contact.metadata?.PersistHistory
                } satisfies ContactMetadataV1)
            })
        }
    };

    const handleToggleContactProcessSameValue = async (contact: IContact) => {
        if (entity && contact) {
            await setMetadataContact.mutateAsync({
                pointer: {
                    entityId: entity.id,
                    channelName: contact.channelName,
                    contactName: contact.contactName
                },
                metadataSerialized: JSON.stringify({
                    ...contact.metadata,
                    Version: contact.metadata?.Version ?? 1,
                    ProcessSameValue: !contact.metadata?.ProcessSameValue
                } satisfies ContactMetadataV1)
            });
        }
    };

    return (
        <>
            <Card className="p-0">
                <Row justifyContent="space-between" className="px-3 py-2">
                    <Typography>{t('Contacts')}</Typography>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <IconButton size="sm" variant="plain" title="More">
                                <MoreHorizontal />
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
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.Head>Contact</Table.Head>
                                <Table.Head>Value</Table.Head>
                                <Table.Head></Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {entity?.contacts?.map(c => (
                            <Table.Row key={`${c.entityId}-${c.channelName}-${c.contactName}`}>
                                <Table.Cell>
                                    <Row spacing={1}>
                                    <ChannelLogo channelName={c.channelName} size="tiny" label={c.channelName} />
                                        <Stack>
                                            <Typography noWrap level="body1">{camelToSentenceCase(c.contactName)}</Typography>
                                            <Row spacing={1}>
                                                <div className="text-xs text-muted-foreground">
                                                    <Timeago date={c.timeStamp} live />
                                                </div>
                                                {c.metadata?.PersistHistory && (
                                                    <Chip title="Persist history" size="sm"><History size={14} /></Chip>
                                                )}
                                                {c.metadata?.ProcessSameValue && (
                                                    <Chip size="sm">Process same value</Chip>
                                                )}
                                            </Row>
                                        </Stack>
                                    </Row>
                                </Table.Cell>
                                <Table.Cell>
                                    {isJson(c.valueSerialized)
                                        ? <DisplayJson className="grow" json={c.valueSerialized} />
                                        : <Typography className="grow" level="body1">{c.valueSerialized}</Typography>}
                                </Table.Cell>
                                <Table.Cell className="flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <IconButton size="sm" variant="plain" title="More">
                                                <MoreHorizontal />
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
                                                startDecorator={<CircleEqual />}
                                            >
                                                {t(c.metadata?.ProcessSameValue ? 'ContactDisableProcessSameValue' : 'ContactEnableProcessSameValue')}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setValueSerialized(c.valueSerialized ?? '');
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
                                </Table.Cell>
                            </Table.Row>
                        ))}
                        </Table.Body>
                    </Table>
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
                onClose={() => setEditingContactDialogOpen(false)}
                actions={(<Button onClick={handleEditValueSubmit}>Save</Button>)}>
                <Input value={valueSerialized} onChange={(e) => setValueSerialized(e.target.value)} />
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

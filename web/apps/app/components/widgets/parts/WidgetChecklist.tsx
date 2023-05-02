import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useState } from 'react';
import { Check, Delete, MoreHorizontal } from '@signalco/ui-icons';
import { IconButton, ListItemContent, ListItemDecorator, Box } from '@signalco/ui';
import { WidgetSharedProps } from '../Widget';
import { DefaultRows, DefaultLabel, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import LocalStorageService from '../../../src/services/LocalStorageService';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useLocale, { useLocalePlaceholders } from '../../../src/hooks/useLocale';
import { Checkbox } from '@signalco/ui/dist/Checkbox';
import { Menu, MenuItem } from '@signalco/ui/dist/Menu';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { Row } from '@signalco/ui/dist/Row';
import { Stack } from '@signalco/ui/dist/Stack';
import { TextField } from '@signalco/ui/dist/TextField';
import { Typography } from '@signalco/ui/dist/Typography';

type ConfigProps = {
    label?: string;
    removeOnDone?: boolean;
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { label: 'Remove when done', name: 'removeOnDone', type: 'yesno', default: true, optional: true },
    DefaultRows(4),
    DefaultColumns(4)
];

interface IChecklistItem {
    id: string,
    done?: boolean,
    text: string
}

function ChecklistItem(props: { item: IChecklistItem; onChange: (id: string, done: boolean) => void; onRemove: (id: string) => void; }) {
    const { item, onChange, onRemove } = props;

    return (
        <>
            <Row justifyContent="space-between">
                <Checkbox checked={item.done ?? false} onChange={(e) => onChange(item.id, e.currentTarget.checked)} label={item.text} />
                <Menu menuId={`widget-checklist-item-${item.id}-options`} renderTrigger={(props) => (
                    <IconButton {...props}><Box sx={{ opacity: 0.3 }}><MoreHorizontal /></Box></IconButton>
                )}>
                    <MenuItem onClick={() => onRemove(item.id)}>
                        <ListItemDecorator>
                            <Delete />
                        </ListItemDecorator>
                        <ListItemContent>Remove</ListItemContent>
                    </MenuItem>
                </Menu>
            </Row>
        </>
    );
}

function WidgetChecklist(props: WidgetSharedProps<ConfigProps>) {
    const { id, config } = props;
    const placeholders = useLocalePlaceholders();
    const { t } = useLocale('App', 'Widgets', 'WidgetChecklist');
    const [items] = useState(LocalStorageService.getItemOrDefault<IChecklistItem[]>(`checklist-${id}`, []));
    const [newItemText, setNewItemText] = useState('');
    const [isInputFocusedOrFilled, setIsInputFocusedOrFilled] = useState(false);

    const removeOnDoneDelay = 500;
    const label = config?.label ?? t('Checklist');
    const removeOnDone = config?.removeOnDone ?? true;

    const saveItems = useCallback((items: IChecklistItem[]) => {
        LocalStorageService.setItem<IChecklistItem[]>(`checklist-${id}`, items);
    }, [id]);

    const handleNewItem = () => {
        if (newItemText.trim().length <= 0)
            return;

        items.push({ id: uuidv4(), text: newItemText });
        saveItems(items);
        setNewItemText('');
    }

    const handleItemChanged = (id: string, done: boolean) => {
        const item = items.find(i => i.id === id);
        if (item) {
            item.done = done;
            if (done && removeOnDone) {
                setTimeout(() => {
                    handleItemRemoved(id);
                }, removeOnDoneDelay);
            } else {
                saveItems(items);
            }
        }
    };

    const handleItemRemoved = (id: string) => {
        items.splice(items.findIndex(i => i.id === id), 1);
        saveItems(items);
    };

    // Configure widget
    useWidgetOptions(stateOptions, props);

    return (
        <Stack style={{ height: '100%', paddingTop: 16, paddingBottom: 16 }} spacing={2}>
            <div style={{ paddingLeft: 8, paddingRight: 8 }}>
                <Typography level="h4">{label}</Typography>
            </div>
            <Box sx={{ flexGrow: 1, overflow: 'auto', overflowX: 'hidden' }}>
                <Stack style={{ height: '100%', paddingLeft: 2 * 8, paddingRight: 3 * 8 }}>
                    {items.length
                        ? items.map(item => <ChecklistItem key={item.id} item={item} onChange={handleItemChanged} onRemove={handleItemRemoved} />)
                        : <Box display="flex" height="100%" alignItems="center" justifyContent="center">
                            <NoDataPlaceholder content={placeholders.t('NoItems')} />
                        </Box>}
                </Stack>
            </Box>
            <Box sx={{ px: 2 }}>
                <form onSubmit={handleNewItem}>
                    <TextField
                        placeholder={t('AddItem')}
                        fullWidth
                        size="lg"
                        onFocus={() => setIsInputFocusedOrFilled(true)}
                        onBlur={() => {
                            if (newItemText.length <= 0) {
                                setIsInputFocusedOrFilled(false);
                            }
                        }}
                        endDecorator={isInputFocusedOrFilled &&
                            <IconButton type="submit"><Check /></IconButton>
                        }
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.currentTarget.value)} />
                </form>
            </Box>
        </Stack>
    );
}

export default WidgetChecklist;

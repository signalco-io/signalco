import React from 'react';
import { PopupState } from 'material-ui-popup-state/hooks';
import { Stack } from '@mui/system';
import { Button, Card, Divider, IconButton, Typography } from '@mui/joy';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import useSaveDashboard from 'src/hooks/dashboards/useSaveDashboard';
import useDashboards from 'src/hooks/dashboards/useDashboards';
import { Add, Pin, PinOff } from 'components/shared/Icons';
import ShareEntityChip from '../entity/ShareEntityChip';
import useLocale from '../../src/hooks/useLocale';
import useHashParam from '../../src/hooks/useHashParam';
import DashboardsRepository, { IDashboardModel } from '../../src/dashboards/DashboardsRepository';

interface IDashboardSelectorMenuProps {
    selectedId: string | undefined,
    popupState: PopupState,
    onSelection: (id: string) => void,
    onEditWidgets: () => void,
    onSettings: () => void
}

interface IDashboardSortableItemProps {
    dashboard: IDashboardModel;
    selectedId: string | undefined;
    onSelection: (id: string) => void;
    onFavorite: (id: string) => void;
}

function DashboardSortableItem(props: IDashboardSortableItemProps) {
    const {
        attributes, listeners, setNodeRef, transform, transition,
    } = useSortable({ id: props.dashboard.id });
    const { dashboard, selectedId, onSelection, onFavorite } = props;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Stack direction="row" alignItems="center" sx={{ width: '100%', position: 'relative' }}>
                <Button
                    variant="plain"
                    sx={{ color: dashboard.id !== selectedId ? 'var(--joy-palette-neutral-400)' : 'inherit' }}
                    onClick={() => onSelection(dashboard.id)}
                    fullWidth
                >
                    {dashboard.name}
                </Button>
                <IconButton sx={{ position: 'absolute', right: 0, height: '100%' }} onClick={() => onFavorite(dashboard.id)}>
                    {dashboard.isFavorite ? <Pin /> : <PinOff />}
                </IconButton>
            </Stack>
        </div>
    );
}

function DashboardSelectorMenu(props: IDashboardSelectorMenuProps) {
    const { selectedId, popupState, onSelection, onEditWidgets, onSettings } = props;
    const { t } = useLocale('App', 'Dashboards');
    const [_, setDashboardIdHash] = useHashParam('dashboard');
    const [isFullScreen, setFullScreenHash] = useHashParam('fullscreen');
    const { data: dashboards } = useDashboards();
    const saveDashboard = useSaveDashboard();

    const orderedDashboardIds = dashboards?.slice().sort((a, b) => a.order - b.order).map(d => d.id) ?? [];
    const orderedDashboards = orderedDashboardIds?.map(dor => dashboards?.find(d => dor === d.id)!) ?? [];

    const handleAndClose = (callback: (...params: any[]) => void) => {
        return (...params: any[]) => {
            callback(...params);
            popupState.close();
        };
    }

    const handleNewDashboard = handleAndClose(async () => {
        const newDashboardId = await saveDashboard.mutateAsync({
            name: 'New dashboard'
        });
        setDashboardIdHash(newDashboardId);
    });

    const handleToggleFavorite = async (id: string) => {
        const dashboard = dashboards?.find(d => d.id === id);
        if (dashboard) {
            await DashboardsRepository.favoriteSetAsync(dashboard.id, !dashboard.isFavorite);
        }
    }

    const onFullscreen = () => setFullScreenHash(isFullScreen === 'on' ? undefined : 'on');

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = orderedDashboardIds.indexOf(active.id.toString());
            const newIndex = orderedDashboardIds.indexOf(over.id.toString());
            const newOrderedDashboards = arrayMove(orderedDashboards, oldIndex, newIndex);;
            for (let i = 0; i < newOrderedDashboards.length; i++) {
                newOrderedDashboards[i].order = i;
            }

            await DashboardsRepository.dashboardsOrderSetAsync(newOrderedDashboards.map(d => d.id));
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {
            // Require the mouse to move by 10 pixels before activating
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            // Press delay of 250ms, with tolerance of 5px of movement
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const selectedDashboard = dashboards?.find(d => d.id === selectedId);

    console.debug('Rendering DashboardSelectorMenu')

    return (
        <Card sx={{ gap: 1.5 }}>
            <Stack sx={{ minWidth: 280 }}>
                <Stack sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                        <SortableContext items={orderedDashboardIds}>
                            {orderedDashboards.map((d) => (
                                <DashboardSortableItem
                                    key={d.id}
                                    dashboard={d}
                                    selectedId={selectedId}
                                    onSelection={(id) => handleAndClose(onSelection)(id)}
                                    onFavorite={handleToggleFavorite} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </Stack>
                <Button variant="plain" onClick={handleNewDashboard} startDecorator={<Add />}>{t('NewDashboard')}</Button>
            </Stack>
            <Divider />
            <Stack>
                <Stack direction="row" alignItems="center" sx={{ px: 2 }}>
                    <Typography level="body2" sx={{ flexGrow: 1 }}>{selectedDashboard?.name}</Typography>
                    <ShareEntityChip entity={selectedDashboard} entityType={3} />
                </Stack>
                <Button variant="plain" onClick={handleAndClose(onFullscreen)}>{t('ToggleFullscreen')}</Button>
                <Button variant="plain" onClick={handleAndClose(onSettings)}>{t('Settings')}</Button>
                <Button variant="plain" onClick={handleAndClose(onEditWidgets)}>{t('EditWidgets')}</Button>
            </Stack>
        </Card>
    );
}

export default DashboardSelectorMenu;

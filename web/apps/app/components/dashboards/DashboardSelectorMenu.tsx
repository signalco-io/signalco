import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Divider } from '@signalco/ui-primitives/Divider';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { Add, Pin, PinOff } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import ShareEntityChip from '../entity/ShareEntityChip';
import useLocale from '../../src/hooks/useLocale';
import useSaveDashboard from '../../src/hooks/dashboards/useSaveDashboard';
import useDashboards from '../../src/hooks/dashboards/useDashboards';
import { Dashboard, dashboardsGetFavorites, dashboardsGetOrder, dashboardsSetFavorite, dashboardsSetOrder } from '../../src/dashboards/DashboardsRepository';

interface IDashboardSelectorMenuProps {
    selectedId: string | undefined,
    onSelection: (id: string) => void,
    onEditWidgets: () => void,
    onSettings: () => void
}

interface IDashboardSortableItemProps {
    dashboard: Dashboard;
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

    const favorites = dashboardsGetFavorites();
    const isFacorite = favorites.includes(dashboard.id);

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Row className="relative">
                <Button
                    variant="plain"
                    className={cx(
                        'grow peer',
                        dashboard.id !== selectedId && 'text-neutral-400'
                    )}
                    onClick={() => onSelection(dashboard.id)}
                    fullWidth
                >
                    {dashboard.alias}
                </Button>
                <IconButton
                    className={cx(
                        'absolute right-0 hover:opacity-100 peer-hover:opacity-100',
                        isFacorite ? 'opacity-60' : 'opacity-0'
                    )}
                    size="sm"
                    variant="plain"
                    onClick={() => onFavorite(dashboard.id)}>
                    {isFacorite ? <Pin size={16} /> : <PinOff size={16} />}
                </IconButton>
            </Row>
        </div>
    );
}

function DashboardSelectorMenu(props: IDashboardSelectorMenuProps) {
    const { selectedId, onSelection, onEditWidgets, onSettings } = props;
    const { t } = useLocale('App', 'Dashboards');
    const [, setDashboardId] = useSearchParam('dashboard');
    const [isFullScreen, setFullScreen] = useSearchParam('fullscreen');
    const { data: dashboards } = useDashboards();
    const saveDashboard = useSaveDashboard();

    const incopleteOrderedDashboardIds = dashboardsGetOrder();
    const orderedDashboards = dashboards?.sort((a, b) => {
        const aIndex = incopleteOrderedDashboardIds.indexOf(a.id);
        const bIndex = incopleteOrderedDashboardIds.indexOf(b.id);
        return aIndex - bIndex;
    }) ?? [];
    const orderedDashboardIds = orderedDashboards.map(d => d.id);

    const handleNewDashboard = async () => {
        const newDashboardId = await saveDashboard.mutateAsync({
            alias: 'New dashboard'
        });
        setDashboardId(newDashboardId);
    };

    const handleToggleFavorite = (id: string) => {
        const isFavorite = dashboardsGetFavorites().includes(id);
        dashboardsSetFavorite(id, !isFavorite);
    }

    const onFullscreen = () => setFullScreen(isFullScreen === 'true' ? undefined : 'true');

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = orderedDashboardIds.indexOf(active.id.toString());
            const newIndex = orderedDashboardIds.indexOf(over.id.toString());
            const newOrderedDashboards = arrayMove(orderedDashboards, oldIndex, newIndex);
            dashboardsSetOrder(newOrderedDashboards.map(d => d.id));
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
        <Stack>
            <Stack className="p-2">
                <Stack className="max-h-[50vh] overflow-auto">
                    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                        <SortableContext items={orderedDashboardIds}>
                            {orderedDashboards.map((d) => (
                                <DashboardSortableItem
                                    key={d.id}
                                    dashboard={d}
                                    selectedId={selectedId}
                                    onSelection={onSelection}
                                    onFavorite={handleToggleFavorite} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </Stack>
                <Button variant="plain" onClick={handleNewDashboard} startDecorator={<Add />}>{t('NewDashboard')}</Button>
            </Stack>
            <Divider />
            <Stack className="p-2">
                <Row>
                    <Typography level="body2" className="grow">{selectedDashboard?.alias}</Typography>
                    <ShareEntityChip entity={selectedDashboard} entityType={3} />
                </Row>
                <Button variant="plain" onClick={onFullscreen}>{t('ToggleFullscreen')}</Button>
                <Button variant="plain" onClick={onSettings}>{t('Settings')}</Button>
                <Button variant="plain" onClick={onEditWidgets}>{t('EditWidgets')}</Button>
            </Stack>
        </Stack>
    );
}

export default DashboardSelectorMenu;

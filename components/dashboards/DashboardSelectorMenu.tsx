import { Button, Divider, Stack, Typography } from "@mui/material";
import { PopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { AddSharp } from "@mui/icons-material";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinSharpIcon from '@mui/icons-material/PushPinSharp';
import DashboardsRepository, { IDashboardModel } from "../../src/dashboards/DashboardsRepository";
import { observer } from "mobx-react-lite";
import useHashParam from "../../src/hooks/useHashParam";
import ShareEntityChip from "../entity/ShareEntityChip";
import { CSS } from '@dnd-kit/utilities';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { runInAction } from "mobx";

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

const DashboardSortableItem = observer((props: IDashboardSortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.dashboard.id });
    const { dashboard, selectedId, onSelection, onFavorite } = props;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Stack direction="row" sx={{ width: '100%', position: 'relative' }}>
                <Button
                    disabled={dashboard.id === selectedId}
                    size="large"
                    onClick={() => onSelection(dashboard.id)}
                    sx={{ flexGrow: 1, py: 2 }}
                >
                    <Typography>{dashboard.name}</Typography>
                </Button>
                <Button sx={{ position: 'absolute', right: 0, height: '100%' }} onClick={() => onFavorite(dashboard.id)}>
                    {dashboard.isFavorite ? <PushPinSharpIcon /> : <PushPinOutlinedIcon />}
                </Button>
            </Stack>
        </div>
    );
});

function DashboardSelectorMenu(props: IDashboardSelectorMenuProps) {
    const { selectedId, popupState, onSelection, onEditWidgets, onSettings } = props;
    const [_, setDashboardIdHash] = useHashParam('dashboard');
    const [isFullScreen, setFullScreenHash] = useHashParam('fullscreen');

    const dashboards = DashboardsRepository.dashboards;
    const orderedDashboardIds = dashboards.slice().sort((a, b) => a.order - b.order).map(d => d.id);
    const orderedDashboards = orderedDashboardIds.map(dor => dashboards.find(d => dor === d.id)!);

    const handleAndClose = (callback: (...params: any[]) => void) => {
        return (...params: any[]) => {
            callback(...params);
            popupState.close();
        };
    }

    const handleNewDashboard = handleAndClose(async () => {
        const newDashboardId = await DashboardsRepository.saveDashboardAsync({
            name: 'New dashboard'
        });
        setDashboardIdHash(newDashboardId);
    });

    const handleToggleFavorite = async (id: string) => {
        const dashboard = dashboards.find(d => d.id === id);
        console.log('toggling favorite', dashboard, dashboard?.isFavorite)
        if (dashboard) {
            await DashboardsRepository.favoriteSetAsync(dashboard.id, !dashboard.isFavorite);
        }
    }

    const onFullscreen = () => setFullScreenHash(isFullScreen === 'on' ? undefined : 'on');

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = orderedDashboardIds.indexOf(active.id);
            const newIndex = orderedDashboardIds.indexOf(over.id);
            const newOrderedDashboards = arrayMove(orderedDashboards, oldIndex, newIndex);;
            for (let i = 0; i < newOrderedDashboards.length; i++) {
                runInAction(() => {
                    newOrderedDashboards[i].order = i;
                })
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

    console.debug('Rendering DashboardSelectorMenu')

    return (
        <Stack sx={{ minWidth: 330 }}>
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
            <Button onClick={handleNewDashboard} size="large" startIcon={<AddSharp />} sx={{ py: 2 }}>New dashboard</Button>
            <Divider />
            <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
                <Typography variant="subtitle1" color="textSecondary" sx={{ flexGrow: 1 }}>Dashboard</Typography>
                <ShareEntityChip entity={dashboards.find(d => d.id === selectedId)} entityType={3} />
            </Stack>
            <Button size="large" onClick={handleAndClose(onFullscreen)}>Toggle fullscreen</Button>
            <Button size="large" onClick={handleAndClose(onSettings)}>Settings...</Button>
            <Button size="large" onClick={handleAndClose(onEditWidgets)}>Edit widgets...</Button>
        </Stack>
    );
}

export default observer(DashboardSelectorMenu);

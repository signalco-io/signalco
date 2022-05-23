import { Box, Button, Chip, List, ListItem, ListItemButton, ListItemText, MenuItem, Popover, Skeleton, Slide, Stack, Tooltip, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { } from 'react';
import { IDeviceModel, IDeviceTargetIncomplete } from '../../../src/devices/Device';
import { selectMany } from '../../../src/helpers/ArrayHelpers';
import useDevice from '../../../src/hooks/useDevice';
import {
    usePopupState,
    bindTrigger,
    bindPopover
} from 'material-ui-popup-state/hooks';
import useAllEntities from '../../../src/hooks/useAllEntities';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EntityIcon from './EntityIcon';
import Loadable from '../Loadable/Loadable';
import { ChevronLeft } from '@mui/icons-material';

function EntitySelectionMenu(props: { target?: IDeviceTargetIncomplete; onSelected: (target: IDeviceTargetIncomplete | undefined) => void; }) {
    const {
        target, onSelected
    } = props;

    const entity = useDevice(target?.deviceId);
    const contacts = selectMany(entity?.endpoints ?? [], e => e.contacts.map(c => {
        return {
            deviceId: entity?.id,
            contactName: c.name,
            channelName: e.channel
        };
    }));

    const entities = useAllEntities();
    const handleDeviceSelected = (selectedEntity: IDeviceModel | undefined) => {
        onSelected(selectedEntity ? { deviceId: selectedEntity.id } : undefined);
    };

    return (
        <Box>
            <Slide in={!!!entity}>
                <Stack>
                    <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>Select one entity from list bellow</Typography>
                    <Loadable isLoading={entities.isLoading} error={entities.error}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleDeviceSelected(undefined)}>
                                    <ListItemText>None</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            {entities.items.map(entity => (
                                <ListItem key={entity.id} disablePadding>
                                    <ListItemButton onClick={() => handleDeviceSelected(entity)}>
                                        <ListItemText>{entity.alias}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Loadable>
                </Stack>
            </Slide>
            <Slide in={!!entity}>
                <Stack>
                    <Button fullWidth>
                        <Stack sx={{ width: '100%' }} direction="row" alignItems="center">
                            <ChevronLeft />
                            <Typography>Change entity</Typography>
                        </Stack>
                    </Button>
                </Stack>
            </Slide>
        </Box>
    );
}

export interface DisplayEntityTargetProps {
    isLoading?: boolean;
    target?: IDeviceTargetIncomplete;
    hideContact?: boolean;
    onChanged: (updated?: IDeviceTargetIncomplete) => void;
}

function DisplayDeviceTarget(props: DisplayEntityTargetProps) {
    const {
        isLoading, target, hideContact, onChanged
    } = props;
    const device = useDevice(target?.deviceId);
    const entityMenu = usePopupState({ variant: 'popover', popupId: 'entitytarget-menu' });

    const handleEntitySelected = (target: IDeviceTargetIncomplete | undefined) => {
        onChanged && onChanged(target);
        entityMenu.close();
    };

    const entityName = (device?.alias ?? (device?.identifier ?? target?.deviceId));

    let entityDescription = '';
    if (!device) entityDescription = 'Unknown entity';
    if (!target?.deviceId) entityDescription = 'Select entity';

    const Icon = EntityIcon(device);

    return (
        <>
            <Tooltip title={entityName ?? ''}>
                <Button variant="outlined" fullWidth sx={{ minHeight: 56 }} {...bindTrigger(entityMenu)}>
                    <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="space-between">
                        <Stack spacing={2} direction="row" alignItems="center">
                            {device && <Icon />}
                            <Stack alignItems="start">
                                <Typography>
                                    {isLoading ? <Skeleton width={160} variant="text" /> : entityName}
                                </Typography>
                                {!isLoading && (
                                    <Typography variant="caption" color="textSecondary">
                                        {entityDescription}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                        <Stack spacing={1} direction="row" alignItems="center">
                            {(target && device && !hideContact) && (
                                <Chip label={target.contactName ?? 'None'} />
                            )}
                            <ChevronRightIcon />
                        </Stack>
                    </Stack>
                </Button>
            </Tooltip>
            <Popover
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                {...bindPopover(entityMenu)}>
                <EntitySelectionMenu target={target} onSelected={handleEntitySelected} />
            </Popover>
        </>
    );
}

export default observer(DisplayDeviceTarget);

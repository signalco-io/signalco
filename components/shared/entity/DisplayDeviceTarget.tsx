import { ButtonBase, Chip, Menu, MenuItem, Skeleton, Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { } from 'react';
import { IDeviceModel, IDeviceTarget, IDeviceTargetIncomplete } from '../../../src/devices/Device';
import { selectMany } from '../../../src/helpers/ArrayHelpers';
import useDevice from '../../../src/hooks/useDevice';
import {
    usePopupState,
    bindTrigger,
    bindMenu,
} from 'material-ui-popup-state/hooks';
import useAllEntities from '../../../src/hooks/useAllEntities';

const DeviceSelectionMenuItem = (props: { target?: IDeviceTargetIncomplete, onSelected: (device: IDeviceModel | undefined) => void }) => {
    const {
        target,
        onSelected
    } = props;
    const entities = useAllEntities();

    if (entities.isLoading)
        return <MenuItem disabled>Loading...</MenuItem>;

    return (
        <>
            <MenuItem onClick={() => onSelected(undefined)} selected={typeof target?.deviceId === 'undefined'}>None</MenuItem>
            {entities.items.map(d =>
                <MenuItem
                    key={d.id}
                    onClick={() => onSelected(d)}
                    selected={target?.deviceId === d.id}>
                    {`${d.alias}`}
                </MenuItem>)}
        </>
    );
};

const ContactSelection = (props: { device?: IDeviceModel, target?: IDeviceTargetIncomplete, onSelected: (contact?: IDeviceTarget) => void }) => {
    const {
        device,
        target,
        onSelected
    } = props;
    if (typeof device === 'undefined')
        return <>
            <MenuItem disabled>Select device first</MenuItem>
        </>;

    const items = selectMany(device.endpoints, e => e.contacts.map(c => {
        return {
            deviceId: device.id,
            contactName: c.name,
            channelName: e.channel
        };
    }));

    return (
        <>
            <MenuItem onClick={() => onSelected(undefined)} selected={typeof target?.channelName === 'undefined' || typeof target?.contactName === 'undefined'}>None</MenuItem>
            {items.map(i =>
                <MenuItem
                    key={`${i.channelName}-${i.contactName}`}
                    onClick={() => onSelected(i)}
                    selected={target?.contactName === i.contactName && target?.channelName === i.channelName}>
                    {`${i.contactName} (${i.channelName})`}
                </MenuItem>)}
        </>
    );
}

const DisplayDeviceTarget = observer((props: { target?: IDeviceTargetIncomplete, hideDevice?: boolean, hideContact?: boolean, onChanged: (updated?: IDeviceTargetIncomplete) => void }) => {
    const device = useDevice(props.target?.deviceId);
    const deviceMenu = usePopupState({ variant: 'popover', popupId: 'devicetarget-device-menu' });
    const contactMenu = usePopupState({ variant: 'popover', popupId: 'devicetarget-device-contact-menu' });

    const isLoading = typeof device === 'undefined';

    const handleDevicesSelected = (device: IDeviceModel | undefined) => {
        // Retrieve available contact, set undefined if no matching
        let channel = props.target?.channelName;
        let contact = props.target?.contactName;
        if (typeof device?.endpoints.filter(e => e.channel === channel)[0]?.contacts.filter(c => c.name === contact) === 'undefined') {
            channel = undefined;
            contact = undefined;
        }

        props.onChanged(device ? {
            deviceId: device.id,
            channelName: channel,
            contactName: contact
        } : undefined);
        deviceMenu.close();
    }

    const handleContactSelected = (contact?: IDeviceTarget) => {
        props.onChanged(props.target?.deviceId ? {
            deviceId: props.target.deviceId,
            channelName: contact?.channelName,
            contactName: contact?.contactName
        } : undefined);
        contactMenu.close();
    }

    const ITEM_HEIGHT = 48;
    const deviceDisplayName = (device?.alias ?? props.target?.deviceId) ?? 'None';

    return (
        <Stack direction="row" spacing={1}>
            {(!props.hideDevice) && (
                <>
                    <ButtonBase {...bindTrigger(deviceMenu)}>
                        <Chip label={isLoading ? <Skeleton width={160} variant="text" /> : deviceDisplayName} title={deviceDisplayName} />
                    </ButtonBase>
                    <Menu {...bindMenu(deviceMenu)}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 6.5,
                                width: '30ch',
                            },
                        }}>
                        <DeviceSelectionMenuItem target={props.target} onSelected={handleDevicesSelected} />
                    </Menu>
                </>
            )}
            {(props.target?.deviceId && !props.hideContact) && (
                <>
                    <ButtonBase {...bindTrigger(contactMenu)}>
                        <Chip label={props.target.contactName ?? 'None'} title={`${props.target.channelName} | ${props.target.contactName}`} />
                    </ButtonBase>
                    <Menu {...bindMenu(contactMenu)}>
                        <ContactSelection device={device} target={props.target} onSelected={handleContactSelected} />
                    </Menu>
                </>
            )}
        </Stack>
    );
});

export default DisplayDeviceTarget;

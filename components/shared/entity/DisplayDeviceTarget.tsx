import { ButtonBase, Chip, Menu, MenuItem, Skeleton, Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { IDeviceModel, IDeviceTarget, IDeviceTargetIncomplete } from "../../../src/devices/Device";
import DevicesRepository from "../../../src/devices/DevicesRepository";
import { selectMany } from '../../../src/helpers/ArrayHelpers';

const DeviceSelection = (props: { target?: IDeviceTargetIncomplete, onSelected: (device: IDeviceModel | undefined) => void }) => {
    const {
        target,
        onSelected
    } = props;
    const [devices, setDevices] = useState<IDeviceModel[] | undefined>();

    useEffect(() => {
        (async () => {
            try {
                const devices = await DevicesRepository.getDevicesAsync();
                setDevices(devices);
            } catch (err: any) {
                console.warn("Failed to load device selection devices.", err);
            } finally {
                // TODO: Set loading false
            }
        })();
    }, []);

    if (typeof devices === 'undefined')
        return <>
            <MenuItem disabled>Loading...</MenuItem>
        </>;

    return (
        <>
            <MenuItem onClick={() => onSelected(undefined)} selected={typeof target?.deviceId === 'undefined'}>None</MenuItem>
            {devices.map(d =>
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

const DisplayDeviceTarget = observer((props: { target?: IDeviceTargetIncomplete, onChanged: (updated?: IDeviceTargetIncomplete) => void }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [device, setDevice] = useState<IDeviceModel | undefined>(undefined);
    const [contactMenuAnchorEl, setContactMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [devicesMenuAnchorEl, setDevicesMenuAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                if (props.target?.deviceId) {
                    const device = await DevicesRepository.getDeviceAsync(props.target.deviceId);
                    if (device) {
                        setDevice(device);
                    }
                } else {
                    console.debug("No device to load. Target id: ", props.target?.deviceId);
                }
            }
            catch (err: any) {
                console.warn("Failed to load device target", props.target, err);
            }
            finally {
                setIsLoading(false);
            }
        })();
    }, [props.target, props.target?.deviceId]);

    const handleDevicesSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
        setDevicesMenuAnchorEl(event.currentTarget);
    }

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
        handleDevicesSelectionClosed();
    }

    const handleDevicesSelectionClosed = () => {
        setDevicesMenuAnchorEl(null);
    }

    const handleContactSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
        setContactMenuAnchorEl(event.currentTarget);
    }

    const handleContactSelected = (contact?: IDeviceTarget) => {
        props.onChanged(props.target?.deviceId ? {
            deviceId: props.target.deviceId,
            channelName: contact?.channelName,
            contactName: contact?.contactName
        } : undefined);
        handleContactSelectionClosed();
    }

    const handleContactSelectionClosed = () => {
        setContactMenuAnchorEl(null);
    }

    const ITEM_HEIGHT = 48;
    const deviceDisplayName = (device?.alias ?? props.target?.deviceId) ?? "None";

    return (
        <Stack direction="row" spacing={1}>
            <ButtonBase onClick={handleDevicesSelection} aria-controls="devicetarget-devices-select-menu" aria-haspopup="true">
                <Chip label={isLoading ? <Skeleton width={160} variant="text" /> : deviceDisplayName} title={deviceDisplayName} />
            </ButtonBase>
            {Boolean(devicesMenuAnchorEl) &&
                <Menu
                    id="devicetarget-devices-select-menu"
                    open={Boolean(devicesMenuAnchorEl)}
                    anchorEl={devicesMenuAnchorEl}
                    keepMounted
                    onClose={handleDevicesSelectionClosed}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 6.5,
                            width: '30ch',
                        },
                    }}>
                    <DeviceSelection target={props.target} onSelected={handleDevicesSelected} />
                </Menu>}
            {props.target?.deviceId && (
                <>
                    <ButtonBase onClick={handleContactSelection} aria-controls="devicetarget-contact-select-menu" aria-haspopup="true">
                        <Chip label={props.target.contactName ?? "None"} title={`${props.target.channelName} | ${props.target.contactName}`} />
                    </ButtonBase>
                    <>
                        {Boolean(contactMenuAnchorEl) &&
                            <Menu
                                id="devicetarget-contact-select-menu"
                                open={Boolean(contactMenuAnchorEl)}
                                anchorEl={contactMenuAnchorEl}
                                keepMounted
                                onClose={handleContactSelectionClosed}>
                                <ContactSelection device={device} target={props.target} onSelected={handleContactSelected} />
                            </Menu>}
                    </>
                </>
            )}
        </Stack>
    );
});

export default DisplayDeviceTarget;
import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined';
import React, { useEffect, useState } from "react";
import HttpService from "../../src/services/HttpService";

export interface IDeviceContact {
    name?: string;
    dataType?: string;
}

export interface IDeviceEndpoint {
    channel?: string;
    inputs?: IDeviceContact[];
    outputs?: IDeviceContact[];
}

export interface IDeviceConfiguration {
    alias?: string;
    identifier?: string;
    endpoints?: IDeviceEndpoint[]
}

export interface IDeviceProps {
    deviceConfiguration?: IDeviceConfiguration,
    inline?: boolean
}

export interface IDeviceContactValue {
    contact: IDeviceContact;
    value?: any
}

const Device = (props: IDeviceProps) => {
    const [inputs, setInputs] = useState<IDeviceContactValue[]>([]);

    let boolOutputContacts: IDeviceContact[] | undefined = [];
    let boolInputContacts: IDeviceContact[] | undefined = [];
    const masterEndpoint = props.deviceConfiguration?.endpoints?.filter(e => e.channel === "main");
    if (masterEndpoint?.length) {
        boolOutputContacts = masterEndpoint[0].outputs?.filter(co => co.dataType === "bool") || [];
        boolInputContacts = masterEndpoint[0].inputs?.filter(ci => ci.dataType === "bool") || [];
    }

    const loadInputsAsync = async () => {
        var inputsPromises = boolInputContacts?.map(ci =>       
            HttpService.getAsync(`https://192.168.0.8:5004/beacon/device-state?identifier=${props.deviceConfiguration?.identifier}&contact=${ci.name}`)
                .then<IDeviceContactValue>(v => {
                    return {
                        contact: ci,
                        value: v
                    };
                }));
                
        if (inputsPromises != null) {
            var inputs = await Promise.all(inputsPromises);
            setInputs(inputs);
        }
    }

    useEffect(() => {
        loadInputsAsync();
    }, []);

    const contactValue = (contact: IDeviceContact) => {
        return inputs.filter(i => i.contact.name === contact.name && i.contact.dataType === contact.dataType)[0] || null;
    }

    const handleOutputContact = (contact: IDeviceContact) => {
        if (contact.dataType !== "bool")
            throw Error("Not supported device command.");

        HttpService.requestAsync("https://192.168.0.8:5004/beacon/conduct", "post", {
            target: {
                identifier: props.deviceConfiguration?.identifier,
                channel: "main",
                contact: contact.name
            },
            value: contactValue(contact)?.value === "OFF" ? "ON" : "OFF"
        });
        for (let index = 0; index < 5; index++) {
            setTimeout(() => loadInputsAsync(), (index + 1) * 200);   
        }
    };

    const isActive = contactValue({
        name: "state",
        dataType: "bool"
    })?.value === "ON";

    return (
        <Box width={220}>
            <Grid container direction="row" justifyContent="space-between" alignItems={props.inline ? "center" : "flex-start"}>
                <Grid item>
                    <Box p={props.inline ? 1 : 2}>
                        <Grid container direction={props.inline ? "row" : "column"} alignItems={props.inline ? "center" : "flex-start"} spacing={1}>
                            <Grid item>
                                {isActive 
                                    ? <WbIncandescentIcon fontSize={props.inline ? "default" : "large"} /> 
                                    : <WbIncandescentOutlinedIcon fontSize={props.inline ? "default" : "large"} />}
                            </Grid>
                            <Grid item>
                                <Box maxWidth={120}>
                                    <Typography variant="body2" noWrap>{props.deviceConfiguration?.alias || "Unknown"}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item>
                    <Box p={props.inline ? 0 : 1}>
                        {boolOutputContacts.map(command => (
                            <IconButton aria-label="change device state" onClick={() => handleOutputContact(command)}>
                                <PowerSettingsNewIcon />
                            </IconButton>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Device;
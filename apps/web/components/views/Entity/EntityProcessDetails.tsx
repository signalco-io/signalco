import { useMemo } from 'react';
import { Container, Stack } from '@mui/system';
import { Alert, Card, IconButton, Typography } from '@mui/joy';
import ReportIcon from '@mui/icons-material/Report';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import useContact from 'src/hooks/useContact';
import IEntityDetails from 'src/entity/IEntityDetails';
import { setAsync } from 'src/contacts/ContactRepository';
import Timeago from 'components/shared/time/Timeago';
import DisplayDeviceTarget from 'components/shared/entity/DisplayEntityTarget';

declare module ProcessConfigurationV1 {
    export interface ContactPointer {
        entityId: string;
        channelName: string;
        contactName: string;
    }

    export interface ConditionContact {
        type: 'contact';
        contactPointer: ContactPointer;
    }

    export interface ConditionConstant {
        type: 'value';
        valueSerialized: string;
    }

    export interface ConditionCompare {
        type: 'compare';
        left: Condition;
        op: number;
        right: Condition;
    }

    export type Condition = ConditionContact | ConditionConstant | ConditionCompare;

    export interface Contact {
        contactPointer: ContactPointer;
        valueSerialized: string;
    }

    export interface Conduct {
        id: string;
        type: string;
        conditions: Condition[];
        contacts: Contact[];
    }

    export interface Configuration {
        $schema: string;
        type: number;
        conducts: Conduct[];
    }
}

function Condition(props: { condition: ProcessConfigurationV1.Condition }) {
    const { condition } = props;

    console.log(condition)

    return (
        <div>
            {(condition.type === 'contact') && (
                <>
                    <DisplayDeviceTarget target={condition.contactPointer} selectContact />
                </>
            )}
            {(condition.type === 'value') && (
                <>
                    {condition.valueSerialized}
                </>
            )}
            {(condition.type === 'compare') && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Condition condition={condition.left} />
                    <span>
                        {condition.op === 0 ? ' is ' : ' is not '}
                    </span>
                    <Condition condition={condition.right} />
                </Stack>
            )}
        </div>
    )
}

export default function EntityProcessDetails(props: { entity: IEntityDetails; }) {
    const { entity } = props;
    const configurationErrorContactPointer = { entityId: entity.id, channelName: 'signalco', contactName: 'configurationError' };

    const configurationContact = useContact({ entityId: entity.id, channelName: 'signalco', contactName: 'configuration' });
    const config: ProcessConfigurationV1.Configuration = useMemo(() => configurationContact.data?.valueSerialized ? JSON.parse(configurationContact.data?.valueSerialized) : undefined, [configurationContact.data]);
    const errorContact = useContact(configurationErrorContactPointer);

    const handleDismissError = async () => {
        await setAsync(configurationErrorContactPointer, '');
    }

    return (
        <Container>
            <Stack spacing={2}>
                {errorContact.data?.valueSerialized && (
                    <Alert
                        color="danger"
                        sx={{ alignItems: 'flex-start' }}
                        startDecorator={<ReportIcon sx={{ mx: '4px', fontSize: '24px' }} />}
                        endDecorator={
                            <IconButton size="sm" color="danger" onClick={handleDismissError}>
                              <CloseRoundedIcon />
                            </IconButton>
                          }>
                        <Stack>
                            <Typography>Configuration error</Typography>
                            <Timeago date={errorContact.data.timeStamp} />
                            <Typography level="body3">{errorContact.data?.valueSerialized}</Typography>
                        </Stack>
                    </Alert>
                )}
                <Stack spacing={2}>
                    {config.conducts.map(conduct => (
                        <Card key={conduct.id}>
                            <Typography level="body2">Do</Typography>
                            <Stack spacing={1}>
                                {conduct.contacts.map(conductTargets => (
                                    <div key={`${conductTargets.contactPointer.entityId}-${conductTargets.contactPointer.channelName}-${conductTargets.contactPointer.contactName}`}>
                                        <DisplayDeviceTarget target={conductTargets.contactPointer} value={conductTargets.valueSerialized} selectContact selectValue />
                                    </div>
                                ))}
                            </Stack>
                            <Typography level="body2">When</Typography>
                            <Stack spacing={1}>
                                {conduct.conditions.map((condition, i) => <Condition key={i} condition={condition} />)}
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </Stack>
        </Container>
    );
}

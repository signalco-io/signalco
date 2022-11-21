import { useMemo } from 'react';
import { Close, Play, Warning } from '@signalco/ui-icons';
import { Chip, Row, Stack, Container , Alert, Card, IconButton, Typography } from '@signalco/ui';
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

    export interface ConditionOrGroup {
        type: 'orGroup';
        conditions: Condition[];
    }

    export interface ConditionCompare {
        type: 'compare';
        left: Condition;
        op: number;
        right: Condition;
    }

    export type Condition = ConditionContact | ConditionConstant | ConditionCompare | ConditionOrGroup;

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
                <Row spacing={1}>
                    <Condition condition={condition.left} />
                    <span>
                        {condition.op === 0 ? ' is ' : ' is not '}
                    </span>
                    <Condition condition={condition.right} />
                </Row>
            )}
            {(condition.type === 'orGroup') && (
                <Row spacing={1}>
                    {condition.conditions.map((c, i) => (
                        <>
                            <Condition key={i} condition={c} />
                            {i < condition.conditions.length - 1 && <Typography>or</Typography>}
                        </>
                    ))}
                </Row>
            )}
        </div>
    )
}

function ExecutionDisplay(props: { entity: IEntityDetails }) {
    const { entity } = props;
    const executeContact = useContact({ entityId: entity.id, channelName: 'signalco', contactName: 'executed' });
    const executed = executeContact?.data?.valueSerialized ? JSON.parse(executeContact?.data?.valueSerialized) : undefined;

    return (
        <div>
            <Chip startDecorator={<Play />}>
                <Timeago date={executed?.StartTimeStamp} />
            </Chip>
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
                <ExecutionDisplay entity={entity} />
                {errorContact.data?.valueSerialized && (
                    <Alert
                        color="danger"
                        sx={{ alignItems: 'flex-start' }}
                        startDecorator={<Warning />}
                        endDecorator={
                            <IconButton size="sm" color="danger" onClick={handleDismissError}>
                                <Close />
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
                    {config?.conducts?.map(conduct => (
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

import { Table } from '@signalco/ui-primitives/Table';
import { Row } from '@signalco/ui-primitives/Row';
import { Check, Close } from '@signalco/ui-icons';
import { Timeago } from '@signalco/ui/Timeago';
import { Loadable } from '@signalco/ui/Loadable';
import { useAllAuthPats } from '../../../src/hooks/signalco/pats/useAuthPats';

export function AuthPatsTable() {
    const { data: pats, isLoading, error } = useAllAuthPats();

    console.log(pats);

    return (
        <div className="rounded-lg border">
            <Loadable isLoading={isLoading} error={error} loadingLabel="Loading PATs...">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Alias</Table.Head>
                            <Table.Head>Token</Table.Head>
                            <Table.Head>Expires</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {pats?.map((pat) => (
                            <Table.Row key={`${pat.userId}${pat.patEnd}${pat.expire}${pat.alias}`}>
                                <Table.Cell>{pat.alias}</Table.Cell>
                                <Table.Cell>{`****...****${pat.patEnd}`}</Table.Cell>
                                <Table.Cell>
                                    <Row spacing={1}>
                                        {(pat.expire?.getTime() ?? Number.MAX_VALUE) > new Date().getTime() ? (
                                            <Check className="text-green-500" />
                                        ) : (
                                            <Close className="text-red-500" />
                                        )}
                                        <Timeago date={pat.expire} noDate="Never" />
                                    </Row>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Loadable>
        </div>
    );
}



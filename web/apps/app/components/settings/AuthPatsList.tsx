import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { Loadable } from '@signalco/ui/Loadable';
import { useAllAuthPats } from '../../src/hooks/signalco/pats/useAuthPats';

export function AuthPatsList() {
    const { data: pats, isLoading, error } = useAllAuthPats();

    return (
        <Loadable isLoading={isLoading} error={error} loadingLabel="Loading PATs...">
            <List>
                {pats?.map((pat) => (
                    <ListItem
                        key={`${pat.userId}${pat.patEnd}${pat.expire}${pat.alias}`}
                        label={(
                            <Row spacing={2}>
                                <Typography>{pat.alias}</Typography>
                                <Typography>{`****...****${pat.patEnd}`}</Typography>
                                <Typography>{pat.expire}</Typography>
                            </Row>
                        )} />
                ))}
            </List>
        </Loadable>
    );
}



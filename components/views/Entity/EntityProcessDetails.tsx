import { Typography } from '@mui/material';
import Loadable from 'components/shared/Loadable/Loadable';
import IEntityDetails from 'src/entity/IEntityDetails';
import useContact from 'src/hooks/useContact';

export default function EntityProcessDetails(props: { entity: IEntityDetails; }) {
    const { entity } = props;

    const isEnabledContact = useContact({ entityId: entity.id, channelName: 'config', contactName: 'isEnabled' });
    const isEnabled = isEnabledContact.data?.valueSerialized === 'true';

    return (
        <div>
            <Loadable {...isEnabledContact}>
                <Typography>IsEnabled: {isEnabled.toString()}</Typography>
            </Loadable>
        </div>
    );
}

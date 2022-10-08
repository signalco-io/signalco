import Switch from '@mui/joy/Switch';
import useContact from 'src/hooks/useContact';
import IEntityDetails from 'src/entity/IEntityDetails';
import Loadable from 'components/shared/Loadable/Loadable';

export default function EntityProcessDetails(props: { entity: IEntityDetails; }) {
    const { entity } = props;

    const disabledContact = useContact({ entityId: entity.id, channelName: 'config', contactName: 'disabled' });
    const disabled = disabledContact.data?.valueSerialized === 'true';

    return (
        <div>
            <Loadable isLoading={disabledContact.isLoading}>
                <Switch checked={!disabled} />
            </Loadable>
        </div>
    );
}

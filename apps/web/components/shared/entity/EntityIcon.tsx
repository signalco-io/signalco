import { Channel, Dashboard, Device, Play, Station } from '@signalco/ui-icons';
import IEntityDetails from 'src/entity/IEntityDetails';

export default function EntityIcon(entity: IEntityDetails | undefined) {
    let Icon = Device;

    if (entity) {
        //    { value: '1', label: 'Devices' },
    // { value: '2', label: 'Dashboards' },
    // { value: '3', label: 'Processs' },
    // { value: '4', label: 'Stations' },
    // { value: '5', label: 'Channels' }
        switch(entity.type) {
            case 2:
                Icon = Dashboard;
                break;
            case 3:
                Icon = Play;
                break;
            case 4:
                Icon = Station;
                break;
            case 5:
                Icon = Channel;
                break;
        }

        if (entity.alias.toLowerCase().indexOf('light') >= 0 ||
            entity.alias.toLowerCase().indexOf('lamp') >= 0 ||
            entity.alias.toLowerCase().indexOf('svijetlo') >= 0) {
            // Icon = LightbulbIcon;
        } else if (entity.alias.toLowerCase().indexOf('temp') >= 0) {
            // Icon = ThermostatIcon;
        } else if (entity.alias.toLowerCase().indexOf('motion') >= 0) {
            // Icon = DirectionsRunIcon;
        } else if (entity.alias.toLowerCase().indexOf('tv') >= 0) {
            // Icon = TvIcon;
        } else if (entity.alias.toLowerCase().indexOf('door') >= 0 ||
            entity.alias.toLowerCase().indexOf('vrata') >= 0) {
            // Icon = MeetingRoomIcon;
        } else if (entity.alias.toLowerCase().indexOf('window') >= 0 ||
            entity.alias.toLowerCase().indexOf('prozor') >= 0) {
            // Icon = SensorWindowIcon;
        } else if (entity.alias.toLowerCase().indexOf('socket') >= 0) {
            // Icon = PowerIcon;
        } else if (entity.alias.toLowerCase().indexOf('flower') >= 0) {
            // Icon = LocalFloristIcon;
        } else if (entity.alias.toLowerCase().indexOf('button') >= 0) {
            // Icon = RadioButtonCheckedIcon;
        } else if (entity.alias.toLowerCase().indexOf('heat') >= 0) {
            // Icon = WhatshotIcon;
        } else if (entity.alias.toLowerCase().indexOf('switch') >= 0) {
            // Icon = PowerSettingsNewIcon;
        }
    }
    return Icon;
}

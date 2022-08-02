import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TvIcon from '@mui/icons-material/Tv';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import PowerIcon from '@mui/icons-material/Power';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import IEntityDetails from 'src/entity/IEntityDetails';

export default function EntityIcon(entity: IEntityDetails | undefined) {
    let Icon = DevicesOtherIcon;
    if (entity) {
        if (entity.alias.toLowerCase().indexOf('light') >= 0 ||
            entity.alias.toLowerCase().indexOf('lamp') >= 0 ||
            entity.alias.toLowerCase().indexOf('svijetlo') >= 0) {
            Icon = LightbulbIcon;
        } else if (entity.alias.toLowerCase().indexOf('temp') >= 0) {
            Icon = ThermostatIcon;
        } else if (entity.alias.toLowerCase().indexOf('motion') >= 0) {
            Icon = DirectionsRunIcon;
        } else if (entity.alias.toLowerCase().indexOf('tv') >= 0) {
            Icon = TvIcon;
        } else if (entity.alias.toLowerCase().indexOf('door') >= 0 ||
            entity.alias.toLowerCase().indexOf('vrata') >= 0) {
            Icon = MeetingRoomIcon;
        } else if (entity.alias.toLowerCase().indexOf('window') >= 0 ||
            entity.alias.toLowerCase().indexOf('prozor') >= 0) {
            Icon = SensorWindowIcon;
        } else if (entity.alias.toLowerCase().indexOf('socket') >= 0) {
            Icon = PowerIcon;
        } else if (entity.alias.toLowerCase().indexOf('flower') >= 0) {
            Icon = LocalFloristIcon;
        } else if (entity.alias.toLowerCase().indexOf('button') >= 0) {
            Icon = RadioButtonCheckedIcon;
        } else if (entity.alias.toLowerCase().indexOf('heat') >= 0) {
            Icon = WhatshotIcon;
        } else if (entity.alias.toLowerCase().indexOf('switch') >= 0) {
            Icon = PowerSettingsNewIcon;
        }
    }
    return Icon;
}

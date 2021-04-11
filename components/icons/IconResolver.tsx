import BorderAllIcon from '@material-ui/icons/BorderAll';
import BorderVerticalIcon from '@material-ui/icons/BorderVertical';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import HelpIcon from '@material-ui/icons/Help';
import LocalFloristIcon from '@material-ui/icons/LocalFlorist';
import LockIcon from '@material-ui/icons/Lock';
import PowerIcon from '@material-ui/icons/Power';
import PowerOffOutlinedIcon from '@material-ui/icons/PowerOffOutlined';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined';
import PowerSettingsNewSharpIcon from '@material-ui/icons/PowerSettingsNewSharp';
import WeekendSharpIcon from '@material-ui/icons/WeekendSharp';
import WbSunny from '@material-ui/icons/WbSunny';
import OpacityIcon from '@material-ui/icons/Opacity';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import DoorFrontSharpIcon from '@material-ui/icons/DoorFrontSharp';
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';
import VpnKeySharpIcon from '@material-ui/icons/VpnKeySharp';
import BathtubIcon from '@material-ui/icons/Bathtub';
import WorkIcon from '@material-ui/icons/Work';
import BedSharpIcon from '@material-ui/icons/BedSharp';
import BedtimeSharpIcon from '@material-ui/icons/BedtimeSharp';
import TheatersSharpIcon from '@material-ui/icons/TheatersSharp';
import WcSharpIcon from '@material-ui/icons/WcSharp';
import TvSharpIcon from '@material-ui/icons/TvSharp';
import LightSharpIcon from '@material-ui/icons/LightSharp';
import RestaurantSharpIcon from '@material-ui/icons/RestaurantSharp';
import { createSvgIcon } from '@material-ui/core';

export type availableIcons = "empty" | "restaurant" | "ceilinglight" | "tv" | "wc" | "movie" | "moon" | "bed" | "work" | "bathtub" | "exit" | "key" | "livingroom" | "questionmark" | "lock" | "power" | "touch" | "light" | "droplet" | "sun" | "flower" | "motion" | "window" | "door" | "onoff";

const map = (
    icon?: availableIcons,
    switched: boolean = false) => {
    switch (icon) {
        case "tv": return TvSharpIcon;
        case "wc": return WcSharpIcon;
        case "movie": return TheatersSharpIcon;
        case "moon": return BedtimeSharpIcon;
        case "bed": return BedSharpIcon;
        case "work": return WorkIcon;
        case "bathtub": return BathtubIcon;
        case "restaurant": return RestaurantSharpIcon;
        case "window": return switched ? BorderVerticalIcon : BorderAllIcon;
        case "flower": return LocalFloristIcon;
        case "sun": return WbSunny;
        case "droplet": return OpacityIcon;
        case "ceilinglight": return LightSharpIcon;
        case "light": return switched ? WbIncandescentIcon : WbIncandescentOutlinedIcon;
        case "lock": return LockIcon;
        case "motion": return DirectionsRunIcon;
        case "key": return VpnKeySharpIcon;
        case "power": return switched ? PowerOffOutlinedIcon : PowerIcon;
        case "touch": return TouchAppIcon;
        case "exit": return ExitToAppSharpIcon;
        case "onoff": return PowerSettingsNewSharpIcon;
        case "livingroom": return WeekendSharpIcon;
        case "door": return switched ? DoorFrontSharpIcon : MeetingRoomIcon;
        case "empty": return createSvgIcon(<path></path>, "Empty");
        case "questionmark":
        default: return HelpIcon;
    }
}

export default map;
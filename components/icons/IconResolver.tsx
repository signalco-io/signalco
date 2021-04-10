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
import { createSvgIcon } from '@material-ui/core';

export type availableIcons = "empty" | "exit" | "key" | "livingroom" | "questionmark" | "lock" | "power" | "touch" | "light" | "droplet" | "sun" | "flower" | "motion" | "window" | "door" | "onoff";

const map = (
    icon?: availableIcons,
    switched: boolean = false) => {
    switch (icon) {
        case "window": return switched ? BorderVerticalIcon : BorderAllIcon;
        case "flower": return LocalFloristIcon;
        case "sun": return WbSunny;
        case "droplet": return OpacityIcon;
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
import BorderAllIcon from '@mui/icons-material/BorderAll';
import BorderVerticalIcon from '@mui/icons-material/BorderVertical';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import HelpIcon from '@mui/icons-material/Help';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LockIcon from '@mui/icons-material/Lock';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffOutlinedIcon from '@mui/icons-material/PowerOffOutlined';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import WbIncandescentOutlinedIcon from '@mui/icons-material/WbIncandescentOutlined';
import PowerSettingsNewSharpIcon from '@mui/icons-material/PowerSettingsNewSharp';
import WeekendSharpIcon from '@mui/icons-material/WeekendSharp';
import WbSunny from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DoorFrontSharpIcon from '@mui/icons-material/DoorFrontSharp';
import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';
import VpnKeySharpIcon from '@mui/icons-material/VpnKeySharp';
import BathtubIcon from '@mui/icons-material/Bathtub';
import WorkIcon from '@mui/icons-material/Work';
import BedSharpIcon from '@mui/icons-material/BedSharp';
import BedtimeSharpIcon from '@mui/icons-material/BedtimeSharp';
import TheatersSharpIcon from '@mui/icons-material/TheatersSharp';
import WcSharpIcon from '@mui/icons-material/WcSharp';
import TvSharpIcon from '@mui/icons-material/TvSharp';
import LightSharpIcon from '@mui/icons-material/LightSharp';
import RestaurantSharpIcon from '@mui/icons-material/RestaurantSharp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AirIcon from '@mui/icons-material/Air';
import StopIcon from '@mui/icons-material/Stop';
import { createSvgIcon } from '@mui/material';
import Image from 'next/image';

export type availableIcons = "empty" | "stop" | "wind" | "up" | "down" | "restaurant" | "ceilinglight" | "tv" | "wc" | "movie" | "moon" | "bed" | "work" | "bathtub" | "exit" | "key" | "livingroom" | "questionmark" | "lock" | "power" | "touch" | "light" | "droplet" | "sun" | "flower" | "motion" | "window" | "door" | "onoff";

const map = (
    icon?: availableIcons,
    switched: boolean = false) => {
    switch (icon) {
        case "stop": return StopIcon;
        case "wind": return AirIcon;
        case "up": return KeyboardArrowUpIcon;
        case "down": return KeyboardArrowDownIcon;
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
        case "power": return switched ? PowerIcon : PowerOffOutlinedIcon;
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
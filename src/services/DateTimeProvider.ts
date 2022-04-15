import UserSettingsProvider from "./UserSettingsProvider";
import { getTimeZones } from "@vvo/tzdb";

export class DateTimeProvider {
    static staticDateTime: Date | undefined = undefined;

    now() {
        const timeZoneName = UserSettingsProvider.value('timeZone', undefined);
        const timeZone = getTimeZones().find(tz => tz.name === timeZoneName);
        const _now = DateTimeProvider.staticDateTime ?? new Date();
        return new Date(
            _now.getUTCFullYear(),
            _now.getUTCMonth(),
            _now.getUTCDate(),
            _now.getUTCHours(),
            _now.getUTCMinutes() + (timeZone?.currentTimeOffsetInMinutes ?? 0),
            _now.getUTCSeconds(),
            _now.getUTCMilliseconds());
    }
}

const provider = new DateTimeProvider();

export default provider;

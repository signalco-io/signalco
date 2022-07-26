import UserSettingsProvider from './UserSettingsProvider';
import { getTimeZones, TimeZone } from '@vvo/tzdb';
import { ObjectDict } from '../sharedTypes';

var durationRegex = /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/

class DateTimeProvider {
    static staticDateTime: Date | undefined = undefined;

    static timeZonesCache: ObjectDict<TimeZone> = {};

    private getTimeZoneByName(name: string | undefined) {
        if (!name) return undefined;

        if (!DateTimeProvider.timeZonesCache[name]) {
            DateTimeProvider.timeZonesCache[name] = getTimeZones().find(tz => tz.name === name);
        }

        return DateTimeProvider.timeZonesCache[name];
    }

    now() {
        const timeZoneName = UserSettingsProvider.value<string | undefined>('timeZone', undefined);
        const timeZone = this.getTimeZoneByName(timeZoneName);
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

    at(date: Date, hours?: number, minutes?: number, seconds?: number, ms?: number) {
        var dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0);

        if(hours) dateTime.setHours(hours);
        if(minutes) dateTime.setMinutes(minutes);
        if(seconds) dateTime.setSeconds(seconds);
        if(ms) dateTime.setMilliseconds(ms);

        return dateTime;
    }

    todayAt(hours?: number, minutes?: number, seconds?: number, ms?: number) {
        return this.at(this.now(), hours, minutes, seconds, ms);
    }

    fromDuration(date: Date, duration: string) {
        var matches = duration.match(durationRegex);
        if (!matches) return undefined;

        const years= parseFloat(matches[3]);
        const months= parseFloat(matches[5]);
        const weeks= parseFloat(matches[7]);
        const days= parseFloat(matches[9]);
        const hours= parseFloat(matches[12]);
        const minutes= parseFloat(matches[14]);
        const seconds= parseFloat(matches[16]);

        var dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0);

        if(years) dateTime.setFullYear(dateTime.getFullYear() + years);
        if(months) dateTime.setMonth(dateTime.getMonth() + months);
        if(weeks) dateTime.setDate(dateTime.getDate() + weeks * 7);
        if(days) dateTime.setDate(dateTime.getDate() + days);
        if(hours) dateTime.setHours(hours);
        if(minutes) dateTime.setMinutes(minutes);
        if(seconds) dateTime.setSeconds(seconds);

        return dateTime;
    }

    toDuration(time: Date, includeDate?: boolean) {
        return 'P'
            + (includeDate && (time.getFullYear())? time.getFullYear() + 'Y' : '')
            + (includeDate && (time.getMonth())? time.getMonth() + 'M' : '')
            + (includeDate && (time.getDate())? time.getDate() + 'D' : '')
            + ((time.getHours() || time.getMinutes() || time.getSeconds())? 'T' : '')
            + ((time.getHours())? time.getHours() + 'H' : '')
            + ((time.getMinutes())? time.getMinutes() + 'M' : '')
            + ((time.getSeconds())? time.getSeconds() + 'S' : '');
    }
}

const provider = new DateTimeProvider();

export default provider;

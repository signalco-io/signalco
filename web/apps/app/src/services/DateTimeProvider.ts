// TODO: Move to shared library

const durationRegex = /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/
const staticDateTime: Date | undefined = undefined;

export function now() {
    const _now = staticDateTime ?? new Date();
    return new Date(
        _now.getFullYear(),
        _now.getMonth(),
        _now.getDate(),
        _now.getHours(),
        _now.getMinutes(),// + (timeZone?.currentTimeOffsetInMinutes ?? 0),
        _now.getSeconds(),
        _now.getMilliseconds());
}

export function nowUtc() {
    const _now = staticDateTime ?? new Date();
    return new Date(
        _now.getUTCFullYear(),
        _now.getUTCMonth(),
        _now.getUTCDate(),
        _now.getUTCHours(),
        _now.getUTCMinutes(),
        _now.getUTCSeconds(),
        _now.getUTCMilliseconds());
}

export function at(date: Date, hours?: number, minutes?: number, seconds?: number, ms?: number) {
    const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0);

    if(hours) dateTime.setHours(hours);
    if(minutes) dateTime.setMinutes(minutes);
    if(seconds) dateTime.setSeconds(seconds);
    if(ms) dateTime.setMilliseconds(ms);

    return dateTime;
}

export function todayAt(hours?: number, minutes?: number, seconds?: number, ms?: number) {
    return at(now(), hours, minutes, seconds, ms);
}

export function fromDuration(date: Date, duration: string) {
    const matches = duration.match(durationRegex);
    if (!matches) return undefined;

    const years= parseFloat(matches[3] ?? '0');
    const months= parseFloat(matches[5] ?? '0');
    const weeks= parseFloat(matches[7] ?? '0');
    const days= parseFloat(matches[9] ?? '0');
    const hours= parseFloat(matches[12] ?? '0');
    const minutes= parseFloat(matches[14] ?? '0');
    const seconds= parseFloat(matches[16] ?? '0');

    const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0);

    if(years) dateTime.setFullYear(dateTime.getFullYear() + years);
    if(months) dateTime.setMonth(dateTime.getMonth() + months);
    if(weeks) dateTime.setDate(dateTime.getDate() + weeks * 7);
    if(days) dateTime.setDate(dateTime.getDate() + days);
    if(hours) dateTime.setHours(hours);
    if(minutes) dateTime.setMinutes(minutes);
    if(seconds) dateTime.setSeconds(seconds);

    return dateTime;
}

export function toDuration(time: Date, includeDate?: boolean) {
    return 'P'
        + (includeDate && (time.getFullYear())? time.getFullYear() + 'Y' : '')
        + (includeDate && (time.getMonth())? time.getMonth() + 'M' : '')
        + (includeDate && (time.getDate())? time.getDate() + 'D' : '')
        + ((time.getHours() || time.getMinutes() || time.getSeconds())? 'T' : '')
        + ((time.getHours())? time.getHours() + 'H' : '')
        + ((time.getMinutes())? time.getMinutes() + 'M' : '')
        + ((time.getSeconds())? time.getSeconds() + 'S' : '');
}

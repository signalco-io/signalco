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

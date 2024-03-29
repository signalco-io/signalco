import { getTimes } from 'suncalc';
import UserSettingsProvider from '../services/UserSettingsProvider';
import { now } from '../services/DateTimeProvider';

class SunHelper {
    isDay() {
        const nowTime = now();
        const location = UserSettingsProvider.value('location', undefined);
        if (!location) return undefined;

        const times = getTimes(nowTime, location[0], location[1]);
        return nowTime >= times.sunrise && nowTime <= times.sunset;
    }
}

const helper = new SunHelper();

export default helper;

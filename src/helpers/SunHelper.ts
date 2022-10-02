import SunCalc from 'suncalc';
import UserSettingsProvider from '../services/UserSettingsProvider';
import DateTimeProvider from '../services/DateTimeProvider';

class SunHelper {
    isDay() {
        const now = DateTimeProvider.now();
        const location = UserSettingsProvider.value('location', undefined);
        if (!location) return undefined;

        const times = SunCalc.getTimes(now, location[0], location[1]);
        return now >= times.sunrise && now <= times.sunset;
    }
}

const helper = new SunHelper();

export default helper;

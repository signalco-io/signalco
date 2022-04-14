import DateTimeProvider from "../services/DateTimeProvider";
import UserSettingsProvider from "../services/UserSettingsProvider";
import SunCalc from 'suncalc';

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

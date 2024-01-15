'use client';
import { useEffect } from 'react';
import { isNotNull, noError } from '@enterwell/react-form-validation';
import { FormItems, useFormField } from '@enterwell/react-form-builder';
import useUserSetting from '../../../src/hooks/useUserSetting';
import useLocale from '../../../src/hooks/useLocale';


export function useTimeLocationForm() {
    const { t } = useLocale('App', 'Settings');
    const [userTimeFormat, setUserTimeFormat] = useUserSetting<string>('timeFormat', '1');
    const [userTimeZone, setUserTimeZone] = useUserSetting<string>('timeZone', '0');
    const [userLocation, setUserLocation] = useUserSetting<[number, number] | undefined>('location', undefined);

    const timeLocationForm: FormItems = {
        timeFormat: useFormField(userTimeFormat, isNotNull, 'selectTimeFormat', t('TimeFormat'), { receiveEvent: false }),
        timeZone: useFormField(userTimeZone, isNotNull, 'selectTimeZone', t('TimeZone'), { receiveEvent: false }),
        location: useFormField(userLocation, noError, 'locationMap', t('Location'))
    };

    useEffect(() => {
        if (!timeLocationForm.timeFormat?.error) {
            setUserTimeFormat(timeLocationForm.timeFormat?.value?.trim() || undefined);
        }
    }, [setUserTimeFormat, timeLocationForm.timeFormat]);

    useEffect(() => {
        if (!timeLocationForm.timeZone?.error) {
            setUserTimeZone(timeLocationForm.timeZone?.value?.trim() || undefined);
        }
    }, [setUserTimeZone, timeLocationForm.timeZone]);

    useEffect(() => {
        if (!timeLocationForm.location?.error) {
            setUserLocation(timeLocationForm.location?.value);
        }
    }, [setUserLocation, timeLocationForm.location]);

    return timeLocationForm;
}

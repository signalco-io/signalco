'use client';
import { useEffect } from 'react';
import { isNonEmptyString } from '@enterwell/react-form-validation';
import { FormItems, useFormField } from '@enterwell/react-form-builder';
import useUserSetting from '../../../src/hooks/useUserSetting';
import useLocale from '../../../src/hooks/useLocale';


export function useProfileForm() {
    const { t } = useLocale('App', 'Settings');
    const [userNickName, setUserNickName] = useUserSetting<string>('nickname', '');

    const profileForm: FormItems = {
        nickname: useFormField(userNickName, isNonEmptyString, 'string', t('Nickname')),
    };

    useEffect(() => {
        if (!profileForm.nickname?.error) {
            setUserNickName(profileForm.nickname?.value?.trim() || undefined);
        }
    }, [setUserNickName, profileForm.nickname]);

    return profileForm;
}

import { useCallback, useEffect } from 'react';
import DashboardsRepository from '../../src/dashboards/DashboardsRepository';
import useInterval from '../../src/hooks/useInterval';
import useLocale from '../../src/hooks/useLocale';
import PageNotificationService from '../../src/notifications/PageNotificationService';

export default function useDashboardsUpdateChecker() {
    const { t } = useLocale('App', 'Dashboards', 'UpdateChecker');

    const checkDashboardUpdateAsync = async () => {
        try {
            if (await DashboardsRepository.isUpdateAvailableAsync()) {
                await DashboardsRepository.applyDashboardsUpdateAsync();

                PageNotificationService.show(t('UpdateApplied'));
            }
        } catch (err) {
            console.warn('Failed to check and apply dashboards update', err);
            PageNotificationService.show(t('UpdateError'), 'info');
        }
    };

    useEffect(() => {
        checkDashboardUpdateAsync();
    }, []);

    useInterval(checkDashboardUpdateAsync, 30 * 60000)
}

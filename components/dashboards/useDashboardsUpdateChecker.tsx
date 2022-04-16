import { useEffect } from "react";
import DashboardsRepository from "../../src/dashboards/DashboardsRepository";
import useLocale from "../../src/hooks/useLocale";
import PageNotificationService from "../../src/notifications/PageNotificationService";

export default function useDashboardsUpdateChecker() {
    const { t } = useLocale("App", "Dashboards", "UpdateChecker");

    useEffect(() => {
        const checkDashboardUpdateAsync = async () => {
            try {
                if (await DashboardsRepository.isUpdateAvailableAsync()) {
                    await DashboardsRepository.applyDashboardsUpdateAsync();

                    PageNotificationService.show(t('UpdateApplied'));
                }
            } catch (err) {
                console.warn("Failed to check and apply dashboards update", err);
                PageNotificationService.show(t('UpdateError'), 'info');
            }
        };

        // Set interval for checking dashboard updates (provided or 30min as default) or on refresh
        const token = setInterval(checkDashboardUpdateAsync, 30 * 60000);
        checkDashboardUpdateAsync();
        return () => clearInterval(token);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

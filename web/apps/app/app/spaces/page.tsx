import { DashboardsDefaultRedirect } from '../../components/dashboards/DashboardsDefaultRedirect';
import { Dashboards } from '../../components/dashboards/Dashboards';

export default function SpacesPage() {
    return (
        <DashboardsDefaultRedirect>
            <Dashboards />
        </DashboardsDefaultRedirect>
    );
}

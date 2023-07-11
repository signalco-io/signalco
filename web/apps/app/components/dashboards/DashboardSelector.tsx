import { Suspense, useEffect } from 'react';
import { Select } from '@signalco/ui-icons';
import { Row } from '@signalco/ui/dist/Row';
import { Popper } from '@signalco/ui/dist/Popper';
import { Button } from '@signalco/ui/dist/Button';
import { useSearchParam } from '@signalco/hooks';
import useDashboards from '../../src/hooks/dashboards/useDashboards';
import DashboardSelectorMenu from './DashboardSelectorMenu';
export interface IDashboardSelectorProps {
    onEditWidgets: () => void,
    onSettings: () => void
}

function DashboardSelector(props: IDashboardSelectorProps) {
    const { onEditWidgets, onSettings } = props;
    const [selectedId, setSelectedId] = useSearchParam('dashboard');
    const { data: dashboards } = useDashboards();

    const currentDashboard = dashboards?.find(d => d.id == selectedId);
    const currentName = currentDashboard?.name;
    const favoriteDashboards = dashboards?.filter(d => d.isFavorite);

    // Set initial selection on component and dashboards load
    useEffect(() => {
        if (!selectedId && dashboards?.length) {
            console.log('Selecting first available dashboard', dashboards[0].id);
            setSelectedId(dashboards[0].id);
        }
    }, [selectedId, dashboards, setSelectedId]);

    const handleDashboardSelection = (id: string) => {
        setSelectedId(id);
    }

    console.debug('Rendering DashboardSelector');

    return (
        <Suspense>
            <Row>
                {(dashboards?.length ?? 0) > 0 && (
                    <div>
                        <Popper
                            trigger={(
                                <Button
                                    variant="plain"
                                    size="lg"
                                    endDecorator={<Select className="pointer-events-none" />}>
                                    {currentName}
                                </Button>
                            )}>
                            <DashboardSelectorMenu
                                selectedId={selectedId}
                                onSelection={setSelectedId}
                                onEditWidgets={onEditWidgets}
                                onSettings={onSettings} />
                        </Popper>
                    </div>
                )}
                {(favoriteDashboards?.length ?? 0) > 0 && (
                    <Row>
                        {favoriteDashboards?.map(fd => (
                            <Button
                                key={fd.id}
                                variant="plain"
                                onClick={() => handleDashboardSelection(fd.id)}>
                                {fd.name}
                            </Button>
                        ))}
                    </Row>
                )}
            </Row>
        </Suspense>
    );
}

export default DashboardSelector;

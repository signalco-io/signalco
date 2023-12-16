import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { EntityIconByType } from '../../shared/entity/EntityIcon';

const entityTypes = [
    { value: '1', label: 'Devices' },
    { value: '2', label: 'Spaces' },
    { value: '3', label: 'Process' },
    { value: '4', label: 'Stations' },
    { value: '5', label: 'Channels' }
];

export function EntitiesTitle() {
    const [selectedType, setSelectedType] = useSearchParam('type', '1');

    return (
        <SelectItems
            className="min-w-[160px] max-w-xs"
            variant="plain"
            value={selectedType}
            onValueChange={(v: string) => setSelectedType(v)}
            items={entityTypes.map(t => {
                const EntityIcon = EntityIconByType(parseInt(t.value));
                return ({
                    value: t.value, label: t.label, icon: typeof EntityIcon === 'function' ? <EntityIcon /> : EntityIcon
                });
            })} />
    );
}

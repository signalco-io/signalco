import IEntityDetails from '../../src/entity/IEntityDetails';
import { entityBatteryLevel } from '../../src/entity/EntityHelper';

export function useEntityBattery(entity: IEntityDetails | undefined): { hasBattery: boolean, level: number | undefined } {
    const level = entityBatteryLevel(entity);
    const hasBattery = !Number.isNaN(level);
    return { hasBattery, level };
}

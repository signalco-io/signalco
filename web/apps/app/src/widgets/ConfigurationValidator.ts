import IContactPointer from '../contacts/IContactPointer';
import IWidgetConfigurationOption from './IWidgetConfigurationOption';

const isInvalidateDeviceContactTarget = (value: Partial<IContactPointer>) =>
    !value.entityId ||
    !value.contactName ||
    !value.channelName;

export function IsConfigurationValid<TConfigProps extends Record<string, unknown>>(
    config: TConfigProps,
    options: IWidgetConfigurationOption<TConfigProps>[]) {
    if (!config) return false;
    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        if (!opt || opt.optional) continue;

        const value = config[opt.name];
        if (typeof value === 'undefined' || value == null) {
            console.debug('Config invalid: (option)', opt.name, 'value', value, 'Full config:', config);
            return false;
        }

        switch (opt.type) {
        case 'entity':
            if (typeof value === 'object' && 'deviceId' in value && !value.deviceId) {
                console.debug(`Config invalid: ${String(opt.name)} - deviceTarget, deviceId missing`, config);
                return false;
            }
            break;
        case 'entityContactMultiple':
        case 'entityContactValueMultiple':
            if (!Array.isArray(value) || !value.length) {
                console.debug(`Config invalid: ${String(opt.name)} - multiple but not array or empty`, config);
                return false;
            }

            if ((value as Partial<IContactPointer>[]).filter(v => isInvalidateDeviceContactTarget(v)).length) {
                console.debug(`Config invalid: ${String(opt.name)} - deviceContact multiple, missing options`, config);
                return false;
            }
            break;
        case 'entityContact':
        case 'entityContactValue':
            if (isInvalidateDeviceContactTarget(value)) {
                console.debug(`Config invalid: ${String(opt.name)} - deviceContact, missing options`, config);
                return false;
            }
            break;
        }
    }
    return true;
}

import IContactPointerPartial from 'src/contacts/IContactPointerPartial';
import IWidgetConfigurationOption from './IWidgetConfigurationOption';

const isInvalidateDeviceContactTarget = (value: IContactPointerPartial) =>
    !value.entityId ||
    !value.contactName ||
    !value.channelName;

export const IsConfigurationValid = (config: any, options: IWidgetConfigurationOption[]) => {
    if (!config) return false;
    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        if (opt.optional) continue;

        const value = config[opt.name];
        if (typeof value === 'undefined' || value == null) {
            return false;
        }

        if (opt.multiple && (!Array.isArray(value) || !value.length)) {
            return false;
        }

        switch (opt.type) {
            case 'deviceTarget':
                if (!value.deviceId) {
                    return false;
                }
                break;
            case 'deviceContactTarget':
                if (opt.multiple){
                    if ((value as IContactPointerPartial[]).filter(v => isInvalidateDeviceContactTarget(v)).length) {
                        return false;
                    }
                } else if (isInvalidateDeviceContactTarget(value)) {
                    return false;
                }
                break;
        }
    }
    return true;
};

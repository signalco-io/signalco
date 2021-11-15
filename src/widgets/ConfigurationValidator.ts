import { IWidgetConfigurationOption } from "./IWidgetConfigurationOption";

export const IsConfigurationValid = (config: any, options: IWidgetConfigurationOption[]) => {
    if (!config) return false;
    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        if (opt.optional) continue;

        const value = config[opt.name];
        if (typeof value === 'undefined' || value == null)
            return false;

        switch (opt.type) {
            case 'deviceTarget':
                if (!value.deviceId) return false;
                break;
            case 'deviceContactTarget':
                if (!value.deviceId ||
                    !value.contactName ||
                    !value.channelName) return false;
                break;
        }
    }
    return true;
};

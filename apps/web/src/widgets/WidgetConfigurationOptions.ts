import IWidgetConfigurationOption from './IWidgetConfigurationOption';

export const DefaultWidth: (width: number) => IWidgetConfigurationOption =
    (width?: number) => ({ name: 'columns', label: 'Width', type: 'static', default: width });

export const DefaultHeight: (height: number) => IWidgetConfigurationOption =
    (height?: number) => ({ name: 'rows', label: 'Height', type: 'static', default: height });

export const DefaultLabel: IWidgetConfigurationOption = { name: 'label', label: 'Label', type: 'string', optional: true };

export const DefaultTarget: IWidgetConfigurationOption = { name: 'target', label: 'Target', type: 'deviceContactTarget' };

export const DefaultTargetMultiple: IWidgetConfigurationOption = { name: 'target', label: 'Target', type: 'deviceContactTarget', multiple: true };

export const DefaultTargetWithValue: IWidgetConfigurationOption = { name: 'target', label: 'Target', type: 'deviceContactTargetWithValue' };

export const DefaultTargetWithValueMultiple: IWidgetConfigurationOption = { name: 'target', label: 'Target', type: 'deviceContactTargetWithValue', multiple: true };

import IContactPointer from 'src/contacts/IContactPointer';
import IContact from 'src/contacts/IContact';
import IWidgetConfigurationOption from './IWidgetConfigurationOption';

export const DefaultWidth: (width: number) => IWidgetConfigurationOption<{ columns: number}> =
    (width?: number) => ({ name: 'columns', label: 'Width', type: 'static', default: width });

export const DefaultHeight: (height: number) => IWidgetConfigurationOption<{ rows: number}> =
    (height?: number) => ({ name: 'rows', label: 'Height', type: 'static', default: height });

export const DefaultLabel: IWidgetConfigurationOption<{ label: string}> = { name: 'label', label: 'Label', type: 'string', optional: true };

export const DefaultTarget: IWidgetConfigurationOption<{ target: IContactPointer }> = { name: 'target', label: 'Target', type: 'deviceContactTarget' };

export const DefaultTargetMultiple: IWidgetConfigurationOption<{ target: IContactPointer[] }> = { name: 'target', label: 'Target', type: 'deviceContactTarget', multiple: true };

export const DefaultTargetWithValue: IWidgetConfigurationOption<{ target: IContact }> = { name: 'target', label: 'Target', type: 'deviceContactTargetWithValue' };

export const DefaultTargetWithValueMultiple: IWidgetConfigurationOption<{ target: IContact[] }> = { name: 'target', label: 'Target', type: 'deviceContactTargetWithValue', multiple: true };

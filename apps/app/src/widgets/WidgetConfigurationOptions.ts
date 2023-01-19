import IContactPointerPartial from '../contacts/IContactPointerPartial';
import IContact from '../contacts/IContact';
import IWidgetConfigurationOption from './IWidgetConfigurationOption';

export const DefaultColumns: (columns: number) => IWidgetConfigurationOption<{ columns: number}> =
    (width?: number) => ({ name: 'columns', label: 'Width', type: 'number', default: width });

export const DefaultRows: (rows: number) => IWidgetConfigurationOption<{ rows: number}> =
    (height?: number) => ({ name: 'rows', label: 'Height', type: 'number', default: height });

export const DefaultLabel: IWidgetConfigurationOption<{ label: string}> = { name: 'label', label: 'Label', type: 'string', optional: true };

export const DefaultTarget: IWidgetConfigurationOption<{ target: IContactPointerPartial }> = { name: 'target', label: 'Target', type: 'entityContact' };

export const DefaultTargetMultiple: IWidgetConfigurationOption<{ target: IContactPointerPartial[] }> = { name: 'target', label: 'Target', type: 'entityContactMultiple' };

export const DefaultTargetWithValue: IWidgetConfigurationOption<{ target: IContact }> = { name: 'target', label: 'Target', type: 'entityContactValue' };

export const DefaultTargetWithValueMultiple: IWidgetConfigurationOption<{ target: IContact[] }> = { name: 'target', label: 'Target', type: 'entityContactValueMultiple' };

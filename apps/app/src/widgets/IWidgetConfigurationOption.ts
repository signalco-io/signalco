export type WidgetConfigurationType =
    'string' | 'number' | 'yesno' |
    'entity' |
    'entityContact' | 'entityContactValue' |
    'entityContactMultiple' | 'entityContactValueMultiple' |
    'selectVisual';

type IWidgetConfigurationOption<TConfigProps> = {
    name: keyof TConfigProps,
    label: string,
    type: WidgetConfigurationType,
    default?: any,
    dataUnit?: string,
    data?: any,
    optional?: boolean
}

export default IWidgetConfigurationOption;

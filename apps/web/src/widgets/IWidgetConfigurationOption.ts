type IWidgetConfigurationOption<TConfigProps> = {
    name: keyof TConfigProps,
    label: string,
    type: string,
    default?: any,
    dataUnit?: string,
    data?: any,
    optional?: boolean,
    multiple?: boolean
}

export default IWidgetConfigurationOption;

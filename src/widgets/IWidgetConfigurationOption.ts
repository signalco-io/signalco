export default interface IWidgetConfigurationOption {
    name: string,
    label: string,
    type: string,
    default?: any,
    dataUnit?: string,
    data?: any,
    optional?: boolean
}
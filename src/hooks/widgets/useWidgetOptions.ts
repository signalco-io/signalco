import { useEffect } from 'react';
import { IWidgetSharedProps } from '../../../components/widgets/Widget';
import IWidgetConfigurationOption from '../../widgets/IWidgetConfigurationOption';

const useWidgetOptions = (options: IWidgetConfigurationOption[], props: IWidgetSharedProps) => {
    useEffect(() => {
        props.onOptions(options);
    }, [props, options]);
};

export default useWidgetOptions;
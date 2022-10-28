import { useEffect } from 'react';
import IWidgetConfigurationOption from '../../widgets/IWidgetConfigurationOption';
import { WidgetSharedProps } from '../../../components/widgets/Widget';

const useWidgetOptions = (options: IWidgetConfigurationOption[], props: WidgetSharedProps) => {
    useEffect(() => {
        props.onOptions(options);
    }, [props, options]);
};

export default useWidgetOptions;

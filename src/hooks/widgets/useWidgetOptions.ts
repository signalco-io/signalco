import { useEffect } from 'react';
import { WidgetSharedProps } from '../../../components/widgets/Widget';
import IWidgetConfigurationOption from '../../widgets/IWidgetConfigurationOption';

const useWidgetOptions = (options: IWidgetConfigurationOption[], props: WidgetSharedProps) => {
    useEffect(() => {
        props.onOptions(options);
    }, [props, options]);
};

export default useWidgetOptions;

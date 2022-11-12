import { useEffect } from 'react';
import IWidgetConfigurationOption from '../../widgets/IWidgetConfigurationOption';
import { WidgetSharedProps } from '../../../components/widgets/Widget';

const useWidgetOptions = <TConfigProps>(options: IWidgetConfigurationOption<TConfigProps>[], props: WidgetSharedProps<TConfigProps>) => {
    useEffect(() => {
        props.onOptions(options);
    }, [props, options]);
};

export default useWidgetOptions;

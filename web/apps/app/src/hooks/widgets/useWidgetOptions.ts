import { useEffect } from 'react';
import IWidgetConfigurationOption from '../../widgets/IWidgetConfigurationOption';

const useWidgetOptions = <TConfigProps>(
    options: IWidgetConfigurationOption<TConfigProps>[],
    props: { onOptions: (opts: IWidgetConfigurationOption<TConfigProps>[]) => void }) => {
    useEffect(() => {
        props.onOptions(options);
    }, [props, options]);
};

export default useWidgetOptions;

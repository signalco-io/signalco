import { useEffect } from 'react';
import { WidgetSharedProps } from '../../../components/widgets/Widget';

const useWidgetActive = (newActive: boolean, props: WidgetSharedProps) => {
    useEffect(() => {
        props.onActive(newActive);
    }, [props, newActive]);
}

export default useWidgetActive;

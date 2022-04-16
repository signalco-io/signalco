import { useEffect } from 'react';
import { IWidgetSharedProps } from '../../../components/widgets/Widget';

const useWidgetActive = (newActive: boolean, props: IWidgetSharedProps) => {
    useEffect(() => {
        props.onActive(newActive);
    }, [props, newActive]);
}

export default useWidgetActive;
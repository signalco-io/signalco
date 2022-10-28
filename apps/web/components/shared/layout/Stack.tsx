import { clsx } from 'clsx';
import { ChildrenProps } from 'src/sharedTypes';
import styles from './Stack.module.scss';

export interface StackProps extends ChildrenProps {
    spacing?: number | undefined;
    direction?: any;
    sx?: any;
}

export default function Stack(props: StackProps) {
    const style: any = { '--gap': props.spacing ?? 0 };
    return (
        <div className={clsx(
            styles.root,
            props.direction === 'row' && styles.row
        )} style={style}>{props.children}</div>
    )
}

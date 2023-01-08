import { ChildrenProps } from '../sharedTypes';

/** @alpha */
export interface ContainerProps extends ChildrenProps {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

/** @alpha */
export default function Container({ maxWidth, children }: ContainerProps) {
    let width: number | undefined = 1200;
    switch (maxWidth) {
        case 'md':
            width = 900;
            break;
        case 'sm':
            width = 600;
        case 'xs':
            width = 444;
        case 'xl':
            width = 1536;
        case false:
            width = undefined;
        default:
            break;
    }

    return (
        <div style={{
            width: '100%',
            display: 'block',
            maxWidth: width ? `${width}px` : undefined,
            margin: '0 auto'
        }}>
            {children}
        </div>
    )
}

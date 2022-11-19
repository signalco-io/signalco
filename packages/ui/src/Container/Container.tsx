import { ChildrenProps } from '../sharedTypes';

export interface ContainerProps extends ChildrenProps {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

export default function Container({ maxWidth, children }: ContainerProps) {
    let width = 1200;
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
        default:
            break;
    }

    return (
        <div style={{
            width: '100%',
            display: 'block',
            maxWidth: `${width}px`,
            margin: 'auto'
        }}>
            {children}
        </div>
    )
}

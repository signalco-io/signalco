import { type HTMLAttributes } from 'react';
import { cx } from 'classix';
import { Row } from '@signalco/ui/dist/Row';

export type ToolbarProps = HTMLAttributes<HTMLDivElement>;

export function Toolbar({ children, className }: ToolbarProps) {
    return (
        <Row className={cx('p-2', className)}>
            <div className="grow"></div>
            {children}
        </Row>
    );
}

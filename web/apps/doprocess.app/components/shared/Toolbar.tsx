import { type HTMLAttributes } from 'react';
import { Row } from '@signalco/ui/Row';
import { cx } from '@signalco/ui/cx';

export type ToolbarProps = HTMLAttributes<HTMLDivElement>;

export function Toolbar({ children, className }: ToolbarProps) {
    return (
        <Row className={cx('p-2', className)}>
            <div className="grow"></div>
            {children}
        </Row>
    );
}

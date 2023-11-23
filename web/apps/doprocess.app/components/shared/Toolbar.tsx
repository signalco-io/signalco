import { type HTMLAttributes } from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';

export type ToolbarProps = HTMLAttributes<HTMLDivElement>;

export function Toolbar({ children, className }: ToolbarProps) {
    return (
        <Row className={cx('p-2', className)}>
            <div className="grow"></div>
            {children}
        </Row>
    );
}

import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cx } from '../cx'

function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
    return (
        <div className="relative w-full overflow-auto">
            <table className={cx('w-full caption-bottom-text-sm', className)} {...rest} />
        </div>
    )
}

function Header({ ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <thead {...rest} />
    )
}

function Head({ ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th className="h-12 px-4 text-left align-middle text-base font-medium text-muted-foreground" {...rest} />
    )
}

function Body({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody className={cx('[&_tr:last-child]:border-0', className)} {...rest} />
    )
}

function Row({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr className={cx('border-b transition-colors hover:bg-muted/50', className)} {...rest} />
    )
}

function Cell({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={cx('p-4 text-base align-middle', className)} {...rest} />
    )
}

Table.Header = Header;
Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;

export { Table };

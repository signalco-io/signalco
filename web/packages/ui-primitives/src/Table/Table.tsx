import { HTMLAttributes } from 'react'
import { cx } from '../cx'

function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
    return (
        <table className={cx('w-full overflow-auto', className)} {...rest} />
    )
}

function Header({ ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <thead {...rest} />
    )
}

function Head({ ...rest }: HTMLAttributes<HTMLHeadElement>) {
    return (
        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground" {...rest} />
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

function Cell({ className, ...rest }: HTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={cx('p-4 align-middle', className)} {...rest} />
    )
}

Table.Header = Header;
Table.Head = Head;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;

export { Table };

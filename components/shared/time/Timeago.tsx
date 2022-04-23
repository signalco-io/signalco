import React from 'react';

export default function Timeago(props: { date: number | Date | undefined, live?: boolean }) {
    return (
        <div>{props.date?.toString()}</div>
    )
}

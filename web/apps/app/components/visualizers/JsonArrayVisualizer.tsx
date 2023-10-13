import React from 'react';
import { ParsedJson } from '@signalco/js';
import { ObjectVisualizer } from './ObjectVisualizer';


export function JsonArrayVisualizer(props: { name: string; value: Array<ParsedJson>; }) {
    return (
        <>
            {props.value.map((v, i) => <ObjectVisualizer key={`${props.name}-${i}`} defaultOpen={props.value.length <= 1} name={i.toString()} value={v} />)}
        </>
    );
}

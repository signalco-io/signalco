import React from 'react';
import { ParsedJson, objectWithKey } from '@signalco/js';
import { ObjectVisualizer } from './ObjectVisualizer';


export function JsonNonArrayVisualizer({ value }: { value: ParsedJson; }) {
    if (value === null ||
        typeof (value) === 'undefined') {
        return <div>null</div>;
    }

    if (typeof value === 'object') {
        const propertyNames = Object.keys(value);
        const properties = typeof value !== 'undefined' && propertyNames
            ? propertyNames.map(pn => {
                const obj = objectWithKey(value, pn);
                return ({ name: pn, value: obj != null ? obj[pn] as ParsedJson : null });
            })
            : [];

        return (
            <div>
                {properties && properties.map(prop => <ObjectVisualizer key={prop.name} name={prop.name} value={prop.value} />)}
            </div>
        );
    }

    return null;
}

'use client';

import { List } from '../shared/List';
import { useProcesses } from '../../src/hooks/useProcesses';
import { ProcessesListItem } from './ProcessesListItem';
import { ProcessCreateForm } from './ProcessCreateForm';

export function ProcessesList() {
    return (
        <List
            query={useProcesses}
            itemRender={(item) => (<ProcessesListItem process={item} />)}
            editable
            itemCreateLabel="Create new process"
            createForm={<ProcessCreateForm redirect />} />
    );
}

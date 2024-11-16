import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Row } from '@signalco/ui-primitives/Row';
import { Input } from '@signalco/ui-primitives/Input';
import { DotIndicator } from '@signalco/ui-primitives/DotIndicator';
import { CommentsFilter } from './CommentsFilter';

const noFilterValue = 'all';
const defaultStateValue = 'unresolved';

type CommentsSidebarFilterProps = {
    filter?: CommentsFilter;
    onFilterChange: (filter: CommentsFilter) => void;
    rootElement?: HTMLElement;
};

export function CommentsSidebarFilter({ filter, onFilterChange, rootElement }: CommentsSidebarFilterProps) {
    const availablePages = [
        { label: 'All pages', value: noFilterValue }
    ];

    return (
        <Stack spacing={1}>
            <Row spacing={1}>
                <Input
                    placeholder="Search comments..."
                    value={filter?.keywords ?? ''}
                    onChange={(e) => onFilterChange({ ...filter, keywords: e.target.value })} />
                <SelectItems
                    value={filter?.status ?? defaultStateValue}
                    items={[
                        { label: <Row spacing={1}><DotIndicator color="info" /><Typography>Unresolved</Typography></Row>, value: defaultStateValue },
                        { label: <Row spacing={1}><DotIndicator color="neutral" variant="outlined" /><Typography>Resolved</Typography></Row>, value: 'resolved' }
                    ]}
                    onValueChange={(value) => onFilterChange({ ...filter, status: value })}
                    container={rootElement} />
            </Row>
            <SelectItems
                value={filter?.page ?? noFilterValue}
                items={availablePages}
                onValueChange={(value) => onFilterChange({ ...filter, page: value === noFilterValue ? undefined : value })}
                container={rootElement} />
        </Stack>
    );
}

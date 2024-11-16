import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Filter, PanelRightClose } from '@signalco/ui-icons';

export function CommentsSidebarHeader({ filterOpen, onClose, onToggleFilter }: { filterOpen: boolean; onClose: () => void; onToggleFilter: () => void; }) {
    return (
        <Row justifyContent="space-between">
            <Row spacing={1}>
            </Row>
            <Row>
                {/* TODO Enable when implemented */}
                {/* <IconButton variant={filterOpen ? 'soft' : 'plain'} onClick={onToggleFilter} title="Toggle filter">
                    <Filter size={16} />
                </IconButton> */}
                <IconButton onClick={onClose} variant="plain" title="Close sidebar">
                    <PanelRightClose />
                </IconButton>
            </Row>
        </Row>
    );
}

import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Filter, PanelRightClose } from '@signalco/ui-icons';

export function CommentsSidebarHeader({ filterOpen, onClose, onToggleFilter }: { filterOpen: boolean; onClose: () => void; onToggleFilter: () => void; }) {
    return (
        <Row justifyContent="space-between">
            <Row spacing={1}>
            </Row>
            <Row>
                <Tooltip title="Toggle filter">
                    <IconButton variant={filterOpen ? 'soft' : 'plain'} onClick={onToggleFilter}>
                        <Filter size={16} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Close sidebar">
                    <IconButton onClick={onClose} variant="plain">
                        <PanelRightClose />
                    </IconButton>
                </Tooltip>
            </Row>
        </Row>
    );
}

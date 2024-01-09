import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { PanelRightClose } from '@signalco/ui-icons';

export function CommentsSidebarHeader({ onClose }: { onClose: () => void; }) {
    return (
        <Row justifyContent="space-between">
            <Row spacing={1}>
                <Avatar>G</Avatar>
                <div className="flex flex-col">
                    <Typography>Guest</Typography>
                </div>
            </Row>
            <div className="flex-none">
                <IconButton onClick={onClose} variant="plain">
                    <PanelRightClose />
                </IconButton>
            </div>
        </Row>
    );
}

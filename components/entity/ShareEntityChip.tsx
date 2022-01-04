import { Chip, IconButton, Slide, Stack, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import { IUser } from "../../src/devices/Device";
import { useState } from "react";
import HttpService from "../../src/services/HttpService";
import ShareIcon from '@mui/icons-material/Share';
import AutoTable from "../shared/table/AutoTable";
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import ConfigurationDialog from "../shared/dialog/ConfigurationDialog";

interface IShareEntityChipProps {
    entity?: { id: string, sharedWith?: IUser[] },
    entityType: number,
}

interface IShareEntityModalProps {
    entity: { id: string, sharedWith?: IUser[] },
    entityType: number,
    onClose: () => void
}

function ShareEntityModal(props: IShareEntityModalProps) {
    const { entity, entityType, onClose } = props;
    const [isShareWithNewOpen, setIsShareWithNewOpen] = useState(false);
    const [shareWithNewEmail, setShareWithNewEmail] = useState('');
    const handleShareWithUser = () => {
        setIsShareWithNewOpen(true);
    };

    const handleSubmitShareWithNew = async () => {
        // TODO: Add success/error indicator
        await HttpService.requestAsync("/share/entity", "post", {
            type: entityType, // 1 - Device
            entityId: entity.id,
            userEmails: [shareWithNewEmail]
        });

        entity.sharedWith?.push({ id: '', email: shareWithNewEmail });
        setIsShareWithNewOpen(false);
    };

    const handleCancelShareWithNew = () => {
        setShareWithNewEmail('');
        setIsShareWithNewOpen(false);
    };

    return (
        <ConfigurationDialog
            isOpen
            title={`Shared with (${entity?.sharedWith?.length || 1})`}
            titleActions={(
                <IconButton onClick={handleShareWithUser} size="large">
                    <ShareIcon />
                </IconButton>
            )}
            onClose={onClose}
            noPadding
        >
            <Slide in={isShareWithNewOpen} direction="down" mountOnEnter unmountOnExit>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 1, px: 2 }}>
                    <TextField label="Email address" type="email" fullWidth onChange={(e) => setShareWithNewEmail(e.target.value)} />
                    <Stack direction="row">
                        <IconButton onClick={handleSubmitShareWithNew} size="large" title="Send invitation"><SendIcon /></IconButton>
                        <IconButton onClick={handleCancelShareWithNew} size="large" title="Cancel"><ClearIcon /></IconButton>
                    </Stack>
                </Stack>
            </Slide>
            <AutoTable error={""} isLoading={false} items={entity.sharedWith?.map(u => ({ id: u.id, name: u.fullName ?? u.email, email: u.email }))} />
        </ConfigurationDialog>
    );
}

function ShareEntityChip(props: IShareEntityChipProps) {
    const { entity, entityType } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChipClick = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <Chip onClick={handleChipClick} icon={<PeopleAltSharpIcon fontSize="small" />} label={entity?.sharedWith?.length ?? 0} />
            {(isModalOpen && entity) && <ShareEntityModal entity={entity} entityType={entityType} onClose={() => setIsModalOpen(false)} />}
        </>
    );
}

export default observer(ShareEntityChip);
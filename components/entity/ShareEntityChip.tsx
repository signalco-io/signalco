import { useState } from 'react';
import { IconButton, Slide, Stack, TextField, Tooltip } from '@mui/material';
import Chip from '@mui/joy/Chip';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import ClearIcon from '@mui/icons-material/Clear';
import IUser from 'src/users/IUser';
import AutoTable from '../shared/table/AutoTable';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import HttpService from '../../src/services/HttpService';
import useLocale from '../../src/hooks/useLocale';

interface IShareEntityChipProps {
    entity?: { id: string, sharedWith?: IUser[] };
    entityType: number;
    disableAction?: boolean;
    hideSingle?: boolean;
}

interface IShareEntityModalProps {
    entity: { id: string, sharedWith?: IUser[] },
    entityType: number,
    onClose: () => void
}

function ShareEntityModal(props: IShareEntityModalProps) {
    const { entity, entityType, onClose } = props;
    const { t } = useLocale('App', 'Components', 'ShareEntityChip');
    const [isShareWithNewOpen, setIsShareWithNewOpen] = useState(false);
    const [shareWithNewEmail, setShareWithNewEmail] = useState('');
    const handleShareWithUser = () => {
        setIsShareWithNewOpen(true);
    };

    const handleSubmitShareWithNew = async () => {
        // TODO: Add success/error indicator
        await HttpService.requestAsync('/share/entity', 'post', {
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
            title={t('ShareWith')}
            titleActions={(
                <Tooltip title={t('Share')}>
                    <IconButton onClick={handleShareWithUser} size="large">
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
            )}
            onClose={onClose}
            noPadding
        >
            <Slide in={isShareWithNewOpen} direction="down" mountOnEnter unmountOnExit>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 1, px: 2 }}>
                    <TextField label={t('EmailAddress')} type="email" fullWidth onChange={(e) => setShareWithNewEmail(e.target.value)} />
                    <Stack direction="row">
                        <IconButton onClick={handleSubmitShareWithNew} size="large" title={t('SendInvitation')}><SendIcon /></IconButton>
                        <IconButton onClick={handleCancelShareWithNew} size="large" title={t('Cancel')}><ClearIcon /></IconButton>
                    </Stack>
                </Stack>
            </Slide>
            <AutoTable error={''} isLoading={false} items={entity.sharedWith?.map(u => ({ id: u.id, name: u.fullName ?? u.email, email: u.email }))} />
        </ConfigurationDialog>
    );
}

function ShareEntityChip(props: IShareEntityChipProps) {
    const { entity, entityType, disableAction, hideSingle } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (hideSingle && (entity?.sharedWith?.length ?? 0) <= 1) {
        return null;
    }

    const handleChipClick = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <Chip
                onClick={disableAction ? undefined : handleChipClick}
                startDecorator={<PeopleAltSharpIcon fontSize="small" />}>
                {entity?.sharedWith?.length ?? 0}
            </Chip>
            {(isModalOpen && entity) && <ShareEntityModal entity={entity} entityType={entityType} onClose={() => setIsModalOpen(false)} />}
        </>
    );
}

export default ShareEntityChip;

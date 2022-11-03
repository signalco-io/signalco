import { useState } from 'react';
import { Clear, People, Send, Share } from '@signalco/ui-icons';
import { Stack } from '@mui/system';
import { Tooltip , IconButton, TextField } from '@mui/joy';
import IUser from 'src/users/IUser';
import Chip from 'components/shared/indicators/Chip';
import GentleSlide from 'components/shared/animations/GentleSlide';
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
                    <IconButton onClick={handleShareWithUser} variant="plain">
                        <Share />
                    </IconButton>
                </Tooltip>
            )}
            onClose={onClose}
        >
            <GentleSlide appear={isShareWithNewOpen} direction="down" collapsedWhenHidden duration={200}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="end">
                    <TextField
                        placeholder={t('EmailAddress')}
                        type="email"
                        sx={{ maxWidth: '270px' }}
                        onChange={(e) => setShareWithNewEmail(e.target.value)} />
                    <Stack direction="row">
                        <IconButton onClick={handleSubmitShareWithNew} color="success" title={t('SendInvitation')}><Send /></IconButton>
                        <IconButton onClick={handleCancelShareWithNew} title={t('Cancel')}><Clear /></IconButton>
                    </Stack>
                </Stack>
            </GentleSlide>
            <AutoTable error={''} isLoading={false} items={entity.sharedWith?.map(u => ({ id: u.id, name: u.fullName ?? u.email, email: u.email }))} />
        </ConfigurationDialog>
    );
}

function ShareEntityChip(props: IShareEntityChipProps) {
    const { entity, entityType, disableAction, hideSingle } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (hideSingle && (entity?.sharedWith?.length ?? 0) <= 1) {
        return <div></div>;
    }

    const handleChipClick = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <Chip
                onClick={disableAction ? undefined : handleChipClick}
                startDecorator={<People size={16} />}>
                {entity?.sharedWith?.length ?? 0}
            </Chip>
            {(isModalOpen && entity) && <ShareEntityModal entity={entity} entityType={entityType} onClose={() => setIsModalOpen(false)} />}
        </>
    );
}

export default ShareEntityChip;

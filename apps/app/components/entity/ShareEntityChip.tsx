import { useState } from 'react';
import { Clear, People, Send, Share } from '@signalco/ui-icons';
import { Chip, Row, Stack, Tooltip, IconButton, TextField, List, ListItem, ListItemContent, ListDivider, GentleSlide } from '@signalco/ui';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import IUser from '../../src/users/IUser';
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

function ShareEntityModal({ entity, entityType, onClose }: IShareEntityModalProps) {
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
            header={t('ShareWith')}
            headerActions={(
                <Tooltip title={t('Share')}>
                    <IconButton onClick={handleShareWithUser} variant="plain">
                        <Share />
                    </IconButton>
                </Tooltip>
            )}
            onClose={onClose}
        >
            <GentleSlide appear={isShareWithNewOpen} direction="down" collapsedWhenHidden duration={200}>
                <Row spacing={2} justifyContent="end">
                    <TextField
                        placeholder={t('EmailAddress')}
                        type="email"
                        sx={{ maxWidth: '270px' }}
                        onChange={(e) => setShareWithNewEmail(e.target.value)} />
                    <Row>
                        <Tooltip title={t('SendInvitation')}>
                            <IconButton onClick={handleSubmitShareWithNew} color="success" ><Send /></IconButton>
                        </Tooltip>
                        <Tooltip title={t('Cancel')}>
                            <IconButton onClick={handleCancelShareWithNew}><Clear /></IconButton>
                        </Tooltip>
                    </Row>
                </Row>
            </GentleSlide>
            <Stack spacing={1}>
                <List variant="outlined" sx={{
                    borderRadius: 'sm',
                }}>
                    {entity.sharedWith?.map((u, i) => (
                        <>
                            <ListItem key={u.id}>
                                <ListItemContent>
                                    {u.fullName ?? u.email}
                                </ListItemContent>
                            </ListItem>
                            {i < (entity.sharedWith?.length ?? 0) - 1 && (
                                <ListDivider />
                            )}
                        </>
                    ))}
                </List>
            </Stack>
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

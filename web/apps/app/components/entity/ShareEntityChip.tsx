import { useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Chip } from '@signalco/ui-primitives/Chip';
import { Clear, People, Send, Share } from '@signalco/ui-icons';
import { GentleSlide } from '@signalco/ui/GentleSlide';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import IUser from '../../src/users/IUser';
import { requestAsync } from '../../src/services/HttpService';
import useLocale from '../../src/hooks/useLocale';

interface IShareEntityChipProps {
    entity?: { id: string, sharedWith?: IUser[] } | null;
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
        await requestAsync('/share/entity', 'post', {
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
            open
            header={t('ShareWith')}
            headerActions={(
                <IconButton onClick={handleShareWithUser} variant="plain" title={t('Share')}>
                    <Share />
                </IconButton>
            )}
            onClose={onClose}
        >
            <GentleSlide appear={isShareWithNewOpen} direction="down" collapsedWhenHidden duration={200}>
                <Row spacing={2} justifyContent="end">
                    <Input
                        placeholder={t('EmailAddress')}
                        type="email"
                        className="max-w-[270px]"
                        onChange={(e) => setShareWithNewEmail(e.target.value)} />
                    <Row>
                        <IconButton onClick={handleSubmitShareWithNew} color="success" title={t('SendInvitation')}><Send /></IconButton>
                        <IconButton title={t('Cancel')} onClick={handleCancelShareWithNew}><Clear /></IconButton>
                    </Row>
                </Row>
            </GentleSlide>
            <Stack spacing={1}>
                <List>
                    {entity.sharedWith?.map((u) => (
                        <ListItem key={u.id} label={u.fullName ?? u.email} />
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
                startDecorator={<People className="size-4" />}>
                {entity?.sharedWith?.length ?? 0}
            </Chip>
            {(isModalOpen && entity) && <ShareEntityModal entity={entity} entityType={entityType} onClose={() => setIsModalOpen(false)} />}
        </>
    );
}

export default ShareEntityChip;

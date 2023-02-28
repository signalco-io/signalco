import React, { useEffect, useState } from 'react';
import {
    Accordion, Row, Typography,
    Box
} from '@signalco/ui';
import IContactPointer from '../../../src/contacts/IContactPointer';
import EntitySelection from './EntitySelection';
import EntityIconLabel from './EntityIconLabel';
import EntityContactValueSelection from './EntityContactValueSelection';
import EntityContactSelection from './EntityContactSelection';
import { ContactPointerRequiredEntity } from './DisplayEntityTarget';

export type EntitySelectionMenuProps = {
    target?: Partial<IContactPointer>;
    selectContact?: boolean;
    selectValue?: boolean;
    valueSerialized?: string | undefined;
    onSelected: (target: Partial<IContactPointer> | undefined, valueSerialized: string | undefined) => void;
    onClose: () => void;
}

export default function EntitySelectionMenu({
    target, selectContact, selectValue, valueSerialized, onSelected, onClose
}: EntitySelectionMenuProps) {
    const [selecting, setSelecting] = useState<'entity' | 'contact' | 'value'>(
        (selectValue && target?.contactName)
            ? 'value'
            : (selectContact && target?.entityId
                ? 'contact'
                : 'entity'));
    const entitySelected = target?.entityId;
    const contactSelected = !!(entitySelected && target?.channelName && target?.contactName);

    useEffect(() => {
        if (selectValue && contactSelected) {
            setSelecting('value');
        } else if (selectContact && entitySelected) {
            setSelecting('contact');
        } else {
            setSelecting('entity');
        }
    }, [contactSelected, entitySelected, selectContact, selectValue]);

    const handleEditEntity = () => {
        setSelecting('entity');
    };

    const handleEntitySelected = (target: Partial<IContactPointer> | undefined) => {
        onSelected(target, undefined);
        if (!selectContact && target?.entityId) {
            onClose();
        }
    };

    const handleContactSelected = (target: Partial<IContactPointer> | undefined) => {
        onSelected(target, undefined);
        if (!selectValue && target?.channelName && target?.contactName) {
            onClose();
        }
    };

    const handleContactValueSelected = (newValueSerialized: string | undefined) => {
        onSelected(target, newValueSerialized);
        if (typeof newValueSerialized !== undefined) {
            onClose();
        }
    };

    return (
        <>
            <Accordion
                open={selecting === 'entity'}
                sx={{ flexGrow: selecting === 'entity' ? 1 : 0 }}
                onChange={handleEditEntity}
                unmountOnExit
            >
                <Typography>
                    {entitySelected ? (
                        <EntityIconLabel entityId={target.entityId} />
                    ) : (
                        <Typography level="body2">Select entity</Typography>
                    )}
                </Typography>
                <Box sx={{ p: 0, overflow: 'auto' }}>
                    <EntitySelection target={target} onSelected={handleEntitySelected} />
                </Box>
            </Accordion>
            {(selectContact && entitySelected) && (
                <Accordion
                    sx={{ flexGrow: selecting === 'contact' ? 1 : 0 }}
                    open={selecting === 'contact'}
                    disabled={selecting !== 'contact' && !entitySelected}
                    unmountOnExit
                >
                    <Typography>
                        <Row spacing={2}>
                            {contactSelected ? (
                                <Typography>{target.contactName}</Typography>
                            ) : (
                                <>
                                    <Typography>Contact</Typography>
                                    {!entitySelected && (
                                        <>
                                            <Typography level="body2">Select entity first</Typography>
                                        </>
                                    )}
                                </>
                            )}
                        </Row>
                    </Typography>
                    <EntityContactSelection target={target as ContactPointerRequiredEntity} onSelected={handleContactSelected} />
                </Accordion>
            )}
            {(selectValue && contactSelected) && (
                <Accordion
                    sx={{ flexGrow: selecting === 'value' ? 1 : 0 }}
                    open={selecting === 'value'}
                    disabled={selecting !== 'value' && !contactSelected}
                    unmountOnExit
                >
                    <Typography>
                        <Row spacing={2}>
                            <Typography>Value</Typography>
                            {!contactSelected && <Typography level="body2">Select contact first</Typography>}
                        </Row>
                    </Typography>
                    <EntityContactValueSelection target={target as IContactPointer} valueSerialized={valueSerialized} onSelected={handleContactValueSelected} />
                </Accordion>
            )}
        </>
    );
}

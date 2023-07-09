import React from 'react';
import {
    bindTrigger,
    usePopupState
} from 'material-ui-popup-state/hooks';
import { Typography } from '@signalco/ui/dist/Typography';
import { Row } from '@signalco/ui/dist/Row';
import { Popper } from '@signalco/ui/dist/Popper';
import { Card } from '@signalco/ui/dist/Card';
import { Button } from '@signalco/ui/dist/Button';
import { camelToSentenceCase } from '@signalco/js';
import IContactPointer from '../../../src/contacts/IContactPointer';
import EntitySelectionMenu from './EntitySelectionMenu';
import EntityIconLabel from './EntityIconLabel';

export type ContactPointerRequiredEntity =
    (Partial<IContactPointer> & Pick<IContactPointer, 'entityId'>)
    | IContactPointer;

export type DisplayEntityTargetProps = {
    target?: Partial<IContactPointer>;
    selectContact?: boolean;
    selectValue?: boolean;
    valueSerialized?: string | undefined;
    onChanged?: (updated: Partial<IContactPointer> | undefined, valueSerialized: string | undefined) => void;
}

function DisplayEntityTarget({ target, selectContact, selectValue, valueSerialized, onChanged }: DisplayEntityTargetProps) {
    const entityMenu = usePopupState({ variant: 'popover', popupId: 'entitytarget-menu' });

    const handleEntitySelected = (target: Partial<IContactPointer> | undefined, valueSerialized: string | undefined) => {
        onChanged && onChanged(target, valueSerialized);
    };

    const handleEntitySelectionClose = () => {
        entityMenu.close();
    }

    let entityDescription = '';
    if (!target?.entityId) entityDescription = 'Select entity';

    return (
        <>
            <Button variant="outlined" fullWidth {...bindTrigger(entityMenu)}>
                <Row style={{ width: '100%' }} spacing={2} justifyContent="space-between">
                    <EntityIconLabel entityId={target?.entityId} description={entityDescription} />
                    <Row spacing={1}>
                        {(target && target.contactName && selectContact) && (
                            <Row spacing={1} alignItems="end">
                                <Typography level="body2">{camelToSentenceCase(target.contactName) ?? 'None'}</Typography>
                                {selectValue && (
                                    <Typography bold>{valueSerialized ?? '-'}</Typography>
                                )}
                            </Row>
                        )}
                    </Row>
                </Row>
            </Button>
            <Popper popupState={entityMenu}>
                <Card className="w-[420px] min-h-80 max-h-80">
                    <EntitySelectionMenu
                        target={target}
                        selectContact={selectContact}
                        selectValue={selectValue}
                        valueSerialized={valueSerialized}
                        onSelected={handleEntitySelected}
                        onClose={handleEntitySelectionClose} />
                </Card>
            </Popper>
        </>
    );
}

export default DisplayEntityTarget;

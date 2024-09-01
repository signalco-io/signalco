import React, { useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { Card } from '@signalco/ui-primitives/Card';
import { Button } from '@signalco/ui-primitives/Button';
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
    const [open, setOpen] = useState(false);

    const handleEntitySelected = (target: Partial<IContactPointer> | undefined, valueSerialized: string | undefined) => {
        onChanged?.(target, valueSerialized);
    };

    const handleEntitySelectionClose = () => {
        setOpen(false);
    }

    let entityDescription = '';
    if (!target?.entityId) entityDescription = 'Select entity';

    return (
        <Popper
            open={open}
            onOpenChange={setOpen}
            trigger={(
                <Button variant="outlined" fullWidth>
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
            )}>
            <Card className="max-h-80 min-h-[320px] w-[420px]">
                <EntitySelectionMenu
                    target={target}
                    selectContact={selectContact}
                    selectValue={selectValue}
                    valueSerialized={valueSerialized}
                    onSelected={handleEntitySelected}
                    onClose={handleEntitySelectionClose} />
            </Card>
        </Popper>
    );
}

export default DisplayEntityTarget;

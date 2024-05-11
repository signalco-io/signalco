import { Typography } from '@signalco/ui-primitives/Typography';
import { cx } from '@signalco/ui-primitives/cx';
import { slug } from '@signalco/js';
import { type SectionData } from '@signalco/cms-core/SectionData';

export function KeyFeature1({ header, description, asset }: SectionData) {
    return (
        <div className={cx('grid items-center gap-y-2 gap-x-4', Boolean(asset) && (header || description) ? 'grid-cols-[auto_1fr]' : 'grid-cols-1')}>
            {asset && (
                <div className="pt-1">
                    {asset}
                </div>
            )}
            {header && <Typography level="body1" semiBold id={slug(header)} >{header}</Typography>}
            {description && <Typography className={cx(Boolean(header && asset) && 'col-start-2')}>{description}</Typography>}
        </div>
    );
}

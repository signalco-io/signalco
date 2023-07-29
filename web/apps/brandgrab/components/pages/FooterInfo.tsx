import React from 'react';
import {Row} from '@signalco/ui/dist/Row';
import {Link} from '@signalco/ui/dist/Link';
import { now } from '../../src/services/DateTimeProvider';
import styles from './FooterInfo.module.scss';

export function FooterInfo() {
    return (
        <div className={styles.root}>
            <small className="text-center">Copyright © {now().getFullYear()} signalco. All rights reserved.</small>
            <Row spacing={4} alignItems="stretch">
                <Link
                    aria-label="X"
                    href="https://x.com/signalco_io">
                    X
                </Link>
                <Link
                    aria-label="reddit"
                    href="https://www.reddit.com/r/signalco/">
                    /r
                </Link>
                <Link
                    aria-label="GitHub"
                    href="https://github.com/signalco-io/signalco">
                    gh
                </Link>
            </Row>
        </div>
    );
}

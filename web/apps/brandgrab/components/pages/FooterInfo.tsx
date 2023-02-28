import React from 'react';
import Row from '@signalco/ui/dist/Row';
import Link from '@signalco/ui/dist/Link';
import { now } from '../../src/services/DateTimeProvider';
import styles from './FooterInfo.module.scss';

export function FooterInfo() {
    return (
        <div className={styles.root}>
            <small className="xs:textAlign-center">Copyright © {now().getFullYear()} signalco. All rights reserved.</small>
            <Row spacing={4} alignItems="stretch">
                <Link
                    aria-label="Twitter link"
                    href="https://twitter.com/signalco_io">
                    tw
                </Link>
                <Link
                    aria-label="reddit link"
                    href="https://www.reddit.com/r/signalco/">
                    /r
                </Link>
                <Link
                    aria-label="GitHub link"
                    href="https://github.com/signalco-io/signalco">
                    gh
                </Link>
            </Row>
        </div>
    );
}

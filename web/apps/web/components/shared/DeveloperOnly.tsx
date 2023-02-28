// TODO: Move to shared UI library

import { ChildrenProps } from '@signalco/ui';
import { isDeveloper } from '../../src/services/EnvProvider';

export default function DeveloperOnly(props: ChildrenProps) {
    if (isDeveloper)
        return <>{props.children}</>;
    return null;
}

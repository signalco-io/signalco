// TODO: Move to shared UI library

import { PropsWithChildren } from 'react';
import { isDeveloper } from '../../src/services/EnvProvider';

export default function DeveloperOnly(props: PropsWithChildren) {
    if (isDeveloper)
        return <>{props.children}</>;
    return null;
}

import { ChildrenProps } from '../../src/sharedTypes';
import AppSettingsProvider from '../../src/services/AppSettingsProvider';

export default function DeveloperOnly(props: ChildrenProps) {
    if (AppSettingsProvider.isDeveloper)
        return <>{props.children}</>;
    return null;
}

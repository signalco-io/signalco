import { Suspense } from 'react';
import { RootRedirect } from '../components/RootRedirect';

export default function Dashboard() {
    return (
        <Suspense>
            <RootRedirect />
        </Suspense>
    );
}

import { Suspense } from 'react';
import LandingPageView from '../../components/views/LandingView';

export default function LandingPage() {
    return (
        <Suspense>
            <LandingPageView />
        </Suspense>
    )
}

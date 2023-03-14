import LandingPageView from '../components/views/LandingView';

export default function LandingPage() {
    return (
        // @ts-expect-error Async Server Component
        <LandingPageView />
    )
}

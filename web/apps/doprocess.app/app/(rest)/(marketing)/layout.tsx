import { ClerkProvider } from '@clerk/nextjs'
import { PageNav } from '../../../components/PageNav';

export default function RootMarketingLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <PageNav fullWidth cta />
            <div className="h-full pt-20">
                {children}
            </div>
        </ClerkProvider>
    );
}

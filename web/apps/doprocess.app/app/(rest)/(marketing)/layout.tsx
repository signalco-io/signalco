import { PageNav } from '../../../components/PageNav';

export default function RootMarketingLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PageNav fullWidth cta />
            <div className="h-full pt-20">
                {children}
            </div>
        </>
    );
}

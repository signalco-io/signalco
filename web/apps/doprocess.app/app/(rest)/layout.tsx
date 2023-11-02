import '../global.css';
import { ClerkProvider } from '@clerk/nextjs'
import { PageNav } from '../../components/PageNav';

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider >
            <PageNav fullWidth />
            <div className="h-full pt-20">
                {children}
            </div>
        </ClerkProvider>
    );
}

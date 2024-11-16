import { SharedClientProvider } from '../../src/components/providers/SharedClientProvider';

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <SharedClientProvider>
            {children}
        </SharedClientProvider>
    );
}

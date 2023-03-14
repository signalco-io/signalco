import '@signalco/ui/dist/ui.css';
import { PageLayout } from '../components/layouts/PageLayout';
import './global.scss';

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <PageLayout>{children}</PageLayout>
            </body>
        </html>
    );
}

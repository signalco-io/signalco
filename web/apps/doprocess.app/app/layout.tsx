import { Metadata } from 'next';
import './global.css';
import { PageNav } from '../components/PageNav';

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <PageNav fullWidth />
                <div className="h-full pt-20">
                    {children}
                </div>
            </body>
        </html>
    );
}

export const metadata = {
    title: 'DoProcess.app',
    description: 'Do process the right way',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ],
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ]
    }
} satisfies Metadata;

import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './global.css';
import { ClientProvider } from '../components/ClientProvider';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans`}>
                <ClientProvider>
                    {children}
                </ClientProvider>
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
    manifest: '/manifest.json',
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
        ],
    }
} satisfies Metadata;

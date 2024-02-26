import { PropsWithChildren } from 'react';
import { AuthSection } from '../../../src/components/auth/AuthSection';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <AuthSection>
            <div className="md:h-full">
                {children}
            </div>
        </AuthSection>
    );
}

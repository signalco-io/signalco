import '../global.css';
import { PageNav } from '../../components/PageNav';

export default function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PageNav fullWidth />
            <div className="h-full pt-20">
                {children}
            </div>
        </>
    );
}

import Error from 'next/error'
import { PageLayout } from '../components/AppLayout';

const NotFound = () => (
    <Error statusCode={404} />
);

NotFound.layout = PageLayout;

export default NotFound;
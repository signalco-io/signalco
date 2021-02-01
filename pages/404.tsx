import Error from 'next/error'

const NotFound = () => (
    <Error statusCode={404} />
);

export default NotFound;
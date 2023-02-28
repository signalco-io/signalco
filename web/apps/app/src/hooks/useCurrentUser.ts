import { useAuth0 } from '@auth0/auth0-react';

export default function useCurrentUser() {
    const { user } = useAuth0();
    return user;
}

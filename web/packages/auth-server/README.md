# @signalco/auth-server

## Getting started

Initialize and expose the `withAuth` function that you can later use to protect your endpoints.

```ts
import { InitAuth } from '@signalco/auth-server';

function jwtSecret() {
    const signSecret = process.env.MYAPP_JWT_SIGN_SECRET;
    return new TextEncoder().encode(signSecret);
}

function getUser(id: string) {
    return db().get<User>(id);
}

export const { withAuth, createJwt } = InitAuth({
    namespace: 'myapp',
    cookieName: 'myapp_session',
    jwtSecretFactory: async () => jwtSecret(),
    getUser
});
```

JWT sign secret should be a 256 bit (32 byte) secret key. You can generate one with `openssl rand -base64 32`. Keep it secret and safe. It should never be exposed to the client or stored in the repository. In example above, it is read from an environment variable.

Tip: If you somehow expose the sign secret, you can rotate it by changing the environment variable and restarting the server. This will invalidate all existing tokens and force users to log in again.

If you want to use a different cookie name, make sure to update the `cookieName` parameter.

Protecting endpoint with `withAuth`:

```ts
import { withAuth } from './auth';

app.get('/api/users/current', async (req, res) => {
    const { user } = await withAuth();
    res.json(req.user);
});
```

## Login

```ts
import { createJwt, setJwtCookie } from './auth';

// ... login logic (validate user credentials, etc.)

setJwtCookie(createJwt(user.id));

// or set cookie manually

const jwt = await createJwt(user.id);
cookies().set(
    'myapp_session', // Make sure this matches configured `cookieName`
    jwt, 
    {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
    });
```

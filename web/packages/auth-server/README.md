# @signalco/auth-server

## Getting started

Initialize and expose functions that you will later use to protect your application.

```ts
// file: auth.ts

import { initAuth } from '@signalco/auth-server';

function jwtSecretFactory() {
    const signSecret = process.env.MYAPP_JWT_SIGN_SECRET;
    return Buffer.from(signSecret, 'base64');
}

export const { withAuth, createJwt, setCookie, clearCookie } = initAuth({
    security: {
        expiry: 60 * 60 * 1000
    },
    jwt: {
        namespace: 'app',
        issues: 'api',
        audience: 'web',
        jwtSecretFactory: jwtSecretFactory,
    },
    cookie: {
        name: 'auth_session'
    },
    getUser: storageGetUser
});
```

JWT sign secret should be a 256 bit (32 byte) secret key. You can generate one with `openssl rand -base64 32`. Keep it secret and safe. It should never be exposed to the client or stored in the repository. In example above, it is read from an environment variable where it is saved as Base64 string and decoded when needed. It is advised to cache the decoded secret in a closure to avoid decoding it every time a token is created or verified.

Tip: If you somehow expose the sign secret, you can rotate it by changing the environment variable and restarting the server. This will invalidate all existing tokens and force users to log in again.

## Protecting route endpoint with `withAuth`

When you want to protect a route, you can use `withAuth` function to wrap your route handler. It will verify the JWT token from the request and pass the user object to your handler if the token is valid. If token is invalid or missing, it will return a 401 Unauthorized response without calling the handler you provided.

```ts
import { withAuth } from './auth';

export async function GET() {
    return await withAuth(async (user) => {
        return new Response(JSON.stringify(user), { status: 200 });
    });
};
```

## Protecting server action with `auth`

When you want to protect a server action, you can use `auth` function to wrap your action handler. It will verify the JWT token from the request and return user data if the token is valid. If token is invalid or missing, the function will throw an error. You can catch this error and return a 401 Unauthorized response to the client.

```ts
import { withAuth } from './auth';

export async function myAction() {
    'use server';

    const { user } = await auth();

    // ... action logic
};
```

## Login

When you authenticate a user, you should create a JWT token and set it as a cookie in the response. You can use `createJwt` and `setCookie` functions for that.

```ts
import { createJwt, setCookie } from './auth';

// ... login logic (validate user credentials, etc.)

setCookie(createJwt(user.id));
```

If you want more control over cookie, you can create and set it manually.

```ts
import { createJwt } from './auth';

(await cookies()).set(
    'auth_session', // Make sure this matches configured `cookie.name`
    await createJwt(user.id), 
    {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 60 * 60 * 1000),
    });
```

## Logout

When you want to log out a user, you should clear the JWT cookie. You can use `clearCookie` function for that.

```ts
import { clearCookie } from './auth';

await clearCookie();
```

## Extensions

### RBAC

You can implement Role-Based Access Control (RBAC) by wrapping `initAuth` function with `initRbac` function. It will override `auth` and `withAuth` functions to include role checking.

```ts
import { initRbac } from '@signalco/auth-server';

export const { withAuth, createJwt, setCookie, clearCookie } = initRbac(initAuth(...));
```

You can then use `withAuth` and `auth` functions as before, but you can also pass a roles to `withAuth` function to check if the user has the required role.

```ts
export async function GET() {
    return await withAuth(['admin'], async (user) => {
        return new Response(JSON.stringify(user), { status: 200 });
    });
};
```

```ts
import { withAuth } from './auth';

export async function myAction() {
    'use server';

    const { user } = await auth(['admin']);

    // ... action logic
};
```

Make sure you pass the roles to auth function when using components that accept auth function as a prop.

```tsx
import { auth } from './auth';

export async function MyComponent() {
    const authAdmin = auth.bind(null, ['admin']);

    return (
        <SignedOut auth={authAdmin}>
            Not logged in
        </SignedOut>
    );
};
```

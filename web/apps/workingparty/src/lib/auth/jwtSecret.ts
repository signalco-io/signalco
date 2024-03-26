export function jwtSecret() {
    const signSecret = process.env.WP_JWT_SIGN_SECRET;
    return new TextEncoder().encode(signSecret);
}
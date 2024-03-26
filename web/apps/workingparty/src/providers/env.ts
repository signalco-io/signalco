const ENV = process.env.NEXT_PUBLIC_APP_ENV;
const ENV_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
const ENV_EMAILDOMAIN = process.env.NEXT_PUBLIC_APP_EMAILDOMAIN;
export const isDeveloper = ENV !== 'production';
export const domain = ENV_DOMAIN ? ENV_DOMAIN : 'localhost:4005';
export const appName = 'Working Party';
export const emailDomain = ENV_EMAILDOMAIN;

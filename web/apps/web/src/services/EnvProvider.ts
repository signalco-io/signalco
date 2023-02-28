// TODO: Move to shared library (dedupe with web,app)

const ENV = process.env.NEXT_PUBLIC_APP_ENV;

export const isDeveloper = ENV !== 'production';

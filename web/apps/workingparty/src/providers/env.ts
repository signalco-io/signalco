const ENV = process.env.NEXT_PUBLIC_APP_ENV;
export const isDeveloper = ENV !== 'production';
export const domain = isDeveloper ? 'next.workingparty.ai' : 'workingparty.ai';
export const appName = 'Working Party';

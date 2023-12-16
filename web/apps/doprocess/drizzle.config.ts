import type { Config } from 'drizzle-kit'
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
dotenvConfig({ path: '.env.local', override: true });

const connectionString = `mysql://${process.env.DOPROCESS_DATABASE_USERNAME}:${process.env.DOPROCESS_DATABASE_PASSWORD}@${process.env.DOPROCESS_DATABASE_HOST}/app?ssl={"rejectUnauthorized":true}`;

export default {
    schema: './src/lib/db/schema.ts',
    out: './src/lib/db/migrations',
    driver: 'mysql2',
    dbCredentials: {
        uri: connectionString,
    },
    breakpoints: true,
} satisfies Config

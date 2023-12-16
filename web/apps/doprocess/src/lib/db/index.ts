import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';

const config = {
    host: process.env.DOPROCESS_DATABASE_HOST,
    username: process.env.DOPROCESS_DATABASE_USERNAME,
    password: process.env.DOPROCESS_DATABASE_PASSWORD
};

const conn = connect(config)

export const db = drizzle(conn);

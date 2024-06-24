import postgres from 'postgres';

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, NEW_PASSWORD } = process.env;
const Oldsql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});
const Newsql = postgres({
    host: 'localhost',
    database: 'ebjn',
    username: 'postgres',
    password:  NEW_PASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});
import postgres from  'postgres';

let NEW_PASSWORD = process.env.NEW_PASSWORD;

console.log(NEW_PASSWORD);

const sql = postgres({
    host: 'localhost',
    database: 'ebjn',
    username: 'postgres',
    password: NEW_PASSWORD,
    port: 5432,
});

sql`select * from users`.then(result => console.log(result));
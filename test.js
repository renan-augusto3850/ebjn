import postgres from 'postgres';

const sql = postgres({
    host: 'ebjn-database.serveo.net',
    database: 'ebjn',
    username: 'postgres',
    password: 'renan2024.com.br.postgres',
    port: 5432,
});
sql`SELECT * FROM books`
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error('Error executing query:', error);
    });

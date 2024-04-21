import Fastify from 'fastify';
import path from 'path';
import { injectSpeedInsights } from '@vercel/speed-insights';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import fs from 'fs';
import {randomUUID} from "crypto";
import formbody from '@fastify/formbody';

const app = Fastify();
injectSpeedInsights();
app.register(formbody);

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const sql = postgres({
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

app.get('/', (req, res) => {
    const archive = fs.createReadStream(path.resolve(process.cwd(), 'index.html'));
    res.type('text/html').send(archive);
});
app.get('/css/:stylesheet', (req, res) => {
    const stylesheet = req.params.stylesheet;
    const archive = fs.createReadStream(path.resolve(process.cwd(), `CSS/${stylesheet}.css`));
    res.send(archive);
});
app.get('/js/:script', (req, res) => {
    const script = req.params.script;
    const archive = fs.createReadStream(path.resolve(process.cwd(), `JS/${script}.js`));
    res.type('script/js').send(archive);
});
app.get('/LIVRO/:nome_do_livro', (req, res) => {
    const livro = req.params.nome_do_livro;
    const archive = fs.createReadStream(path.resolve(process.cwd(), `LIVRO/${livro}.html`));
    res.type('text/html').send(archive);
});
app.get('/cadastro', (req, res) => {
    const archive = fs.createReadStream(path.resolve(process.cwd(), 'cadastro.html'));
    res.type('text/html').send(archive);
});
app.post('/usuario', async(req, res) => {
    const usuario = req.body;
    const securePassword = await bcrypt.hash(usuario.password, 10);
    usuario.id = randomUUID();
    await sql`insert into users (id, name, email, password) values(${usuario.id}, ${usuario.name}, ${usuario.email}, ${securePassword})`;
    res.send(JSON.stringify({result: 'sucessfuly'}));
    
});
app.post('/login', async(req, res) => {
    const usuario = req.body;
    const email = usuario.email;
    const query = await sql`SELECT password FROM users WHERE email = ${email}`;
    usuario.name = await sql`SELECT name FROM users WHERE email = ${email}`;
    usuario.name = usuario.name[0].name
    const hashedPasssword = query[0].password;
    if(await bcrypt.compare(usuario.password, hashedPasssword)) {
        const id = randomUUID();
        await sql`insert into loginsessions (email, id, name) values(${usuario.email}, ${id}, ${usuario.name})`;
        res.send({"result": true, id: id, name: usuario.name});
    } else{
        res.send({"result": false});
    }
});
app.get('/login', (req, res) => {
    const archive = fs.createReadStream(path.resolve(process.cwd(), 'login.html'));
    res.type('text/html').send(archive);
});
app.get('/manifest', (req, res) => {
    const archive = fs.createReadStream(path.resolve(process.cwd(), 'MANIFEST/manifest.json'));
    res.type('application/json').send(archive);
});
app.get('/icon', (req, res) => {
    const archive = fs.createReadStream(path.resolve(process.cwd(), 'ICON/Icon.png'));
    res.type('image/png').send(archive);
});
app.listen({ port: 3000 }, (err, address) => {
    if(err) {
        throw new Error("Server not inicialized");
    }
    console.log(`Rodando em porta 3000!`);
});
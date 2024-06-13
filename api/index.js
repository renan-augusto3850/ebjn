import express from 'express';
import path from 'path';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import pageRange from '../pageRange.js';
import pdfTools from './pdfTools.js';

//const ebjn = new ebjnDrive();
const app = express();
//const upload = multer();
app.use(express.json());
//app.use(cookieParser());
const pdf = new pdfTools();
pdf.convertToImages('./Get_Started_With_Smallpdf.pdf', 'test');

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
//const auth = ebjn.createAuth();
const range = new pageRange();

app.get('/', (req, res) => {
    const archive = path.resolve(process.cwd(), 'index.html');
    res.sendFile(archive);
});
app.get('/css/:stylesheet', (req, res) => {
    const stylesheet = req.params.stylesheet;
    const archive = path.resolve(process.cwd(), `CSS/${stylesheet}.css`);
    res.sendFile(archive);
});
app.get('/js/:script', (req, res) => {
    const script = req.params.script;
    const archive = path.resolve(process.cwd(), `JS/${script}.js`);
    res.sendFile(archive);
});
/*app.get('/googleLogin', (req, res) => {
    const authUrl = auth.generateAuthUrl({
        access_type: 'offline', // Solicita um token de atualização
        scope: ['https://www.googleapis.com/auth/drive'],
    });
    res.redirect(authUrl);
});
app.get('/userCallback', async(req, res) => {
    const { code } = req.query;
    const id = req.cookies.username;
    const { tokens } = await auth.getToken(code);
    google.options({ auth });
    await sql`insert into googleoauth (authToken, id) values(${cryptoJS.AES.encrypt(JSON.stringify(tokens), id).toString()}, "nothing" )`;
    res.redirect("/");
});*/
app.get('/LIVRO/:nome_do_livro', (req, res) => {
    const livro = req.params.nome_do_livro;
    const archive = path.resolve(process.cwd(), `LIVRO/${livro}.html`);
    res.sendFile(archive);
});
app.get('/PAGES/:endereco/:page', (req, res) => {
    const add = req.params.endereco;
    const page = req.params.page;
    const archive = path.resolve(process.cwd(), `PAGES/${add}/${page}`);
    res.sendFile(archive);
});
app.get('/espaco-escola/:page', (req, res) => {
    const page = req.params.page;
    const archive = path.resolve(process.cwd(), `EDUCATOR-SPACE/${page}.html`);
    res.sendFile(archive);
});
app.post('/book', async(req, res) => {
    const query = req.body;
    if(query.operation == "book-add") {
        await sql`insert into booktables (title, author, placeholder, units) values(${query.title}, ${query.author}, ${query.placeholder}, ${query.units})`;
        res.send({result: "sucessfuly"});
    }
    if(query.operation == "book-get") {
        const books = await sql`select * from booktables`;
        res.send(books);
    }
    if(query.operation == "book-delete") {
        await sql`delete from booktables where title = ${query.title}`;
        res.send({result: "sucessfuly"});
    }
    if(query.operation == "book-consult-add") {
        await sql`insert into bookconsult (emailorname, placeholder, startdate, title, serie) values(${query.emailOrname}, ${query.placeholder}, ${query.startDate}, ${query.title}, ${query.serie})`;
        res.send({result: "sucessfuly"});
    }
    if(query.operation == "book-consult-get") {
        const consults = await sql`select * from bookconsult`;
        res.send(consults);
    }
    if(query.operation == "book-consult-finish") {
        await sql`delete from bookconsult where emailorname = ${query.emailOrname}`;
        res.send({result: "sucessfuly"});
    }
});
app.get('/SERIE/:nome_da_serie', (req, res) => {
    const serie = req.params.nome_da_serie;
    const archive = path.resolve(process.cwd(), `SERIE/${serie}.html`);
    res.sendFile(archive);
});
app.get('/assets/:image', (req, res) => {
    const image = req.params.image;
    const archive = path.resolve(process.cwd(), `ASSETS/${image}.png`);
    res.sendFile(archive);
});
app.get('/cadastro', (req, res) => {
    const archive = path.resolve(process.cwd(), 'cadastro.html');
    res.sendFile(archive);
});
app.get('/sobre', (req, res) => {
    const archive = path.resolve(process.cwd(), 'sobre.html');
    res.sendFile(archive);
});
app.post('/usuario', async(req, res) => {
    const usuario = req.body;
    const securePassword = await bcrypt.hash(usuario.password, 10);
    usuario.id = crypto.randomUUID();
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
        const id = crypto.randomUUID();
        await sql`insert into loginsessions (email, id, name) values(${usuario.email}, ${id}, ${usuario.name})`;
        res.send({"result": true, id: id, name: usuario.name});
    } else{
        res.send({"result": false});
    }
});
app.post('/user', async(req, res) => {
    const query = req.body;
    if(query.operation == "read-update") {
        const email = await sql`select email from loginsessions where id = ${query.id}`;
        await sql`INSERT INTO bookprogress (email, id, page, placeholder, date)
        VALUES (${email[0].email}, ${query.id}, ${query.pageNumber}, ${query.placeholder}, ${query.date})
        ON CONFLICT (email, placeholder) DO UPDATE
        SET page = ${query.pageNumber};
        `;
        res.status(201).send({"Result": "ok"});
    }
    if(query.operation == "read-get") {
        const email = await sql`select email from loginsessions where id = ${query.id}`;
        const page = await sql`select page from bookprogress where placeholder = ${query.placeholder} and email = ${email[0].email}`;
        res.send({result: "sucessfuly", page: page});
    }
    if(query.operation == "read-finish") {
        const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
        const email = await sql`select email from loginsessions where id = ${query.id}`;
        const startDate = await sql`select date from bookprogress where email = ${email[0].email} and placeholder = ${query.placeholder}`;
        const medianReadDate = new Date(startDate[0].date.getTime() + query.medianInDays * umDiaEmMilissegundos).toISOString().slice(0, 10);
        if(query.finishDate != undefined) {
            const pnts = range.gerarPontuação(medianReadDate, query.finishDate);
            await sql`INSERT INTO pntstable (id, pnts)
            VALUES (${query.id}, ${pnts.toFixed(1)})
            ON CONFLICT (id) 
            DO UPDATE 
            SET pnts = pntstable.pnts + EXCLUDED.pnts`;
            await sql`delete from bookprogress where id = ${query.id} and placeholder = ${query.placeholder}`;
            res.send({"result": "sucessfuly", "pnts": pnts});
        } else{
            res.statusCode = 500;
        }
    }
    if(query.operation == "pnts-get") {
        const pnts = await sql`select pnts from pntstable where id = ${query.id}`;
        res.send(pnts);
    }
    if(query.operation == "pnts-add") {
        await sql`INSERT INTO pntstable (id, pnts)
        VALUES (${query.id}, ${parseFloat(query.pnts)})
        ON CONFLICT (id) 
        DO UPDATE 
        SET pnts = pntstable.pnts + EXCLUDED.pnts`;
        res.send({result: "sucessfuly"});
    }
});
app.get('/login', (req, res) => {
    const archive = path.resolve(process.cwd(), 'login.html');
    res.sendFile(archive);
});
/*app.get('/upload', (req, res) => {
    const archive = path.resolve(process.cwd(), 'upload.html');
    res.sendFile(archive);
});
app.post('/upload', upload.array('files'), (req, res) => {
    ebjn.upload(req.files).then(() => {
        res.send("<h3>ok</h3>");
    });
});*/
app.get('/manifest', (req, res) => {
    const archive = path.resolve(process.cwd(), 'MANIFEST/manifest.json');
    res.sendFile(archive);
});
app.get('/icon', (req, res) => {
    const archive = path.resolve(process.cwd(), 'ICON/Icon.png');
    res.sendFile(archive);
});
app.listen({ port: 3000 }, (err, address) => {
    if(err) {
        throw new Error("Server not inicialized");
    }
    console.log(`Rodando em porta 3000!`);
});
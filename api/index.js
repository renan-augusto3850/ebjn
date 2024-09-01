import express from 'express';
import path from 'path';
import postgres from 'postgres';
import multer from 'multer';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import pageRange from '../pageRange.js';
import pdfTools from './pdfTools.js';
import SmartSDK from '../smartSDK.js';
import fs from 'fs';
import { randomUUID } from 'crypto';
import NProgress from 'nprogress';
import Users from './users.js';
import Books from './books.js';

//const ebjn = new ebjnDrive();
const app = express();
//const upload = multer();
app.use(express.json());
//app.use(cookiearser());

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD);

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


const range = new pageRange();

const users = new Users();

const books = new Books();

app.set('view engine', 'ejs');
app.set(path.resolve(process.cwd(), 'views'));

app.get('/', async(req, res) => {
    fetch('https://ebjn.serveo.net/books', {
        method: "POST"
    })
    .then(data => data.json())
        .then(query => {
            res.render('index', { query });
    });
});
app.get('/termos-de-servico', (req, res) => {
    const archive = path.resolve(process.cwd(), 'terms.html');
    res.sendFile(archive);
});
app.get('/css/:stylesheet', (req, res) => {
    const stylesheet = req.params.stylesheet;
    const archive = path.resolve(process.cwd(), `CSS/${stylesheet}.css`);
    res.sendFile(archive);
});
app.get('/booktest', (req, res) => {
    const archive = path.resolve(process.cwd(), `test.html`);
    res.sendFile(archive);
});
app.post('/search', async(req, res) => {
    const query = req.body;
    res.send(await books.search(query.search));
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
    }
    res.redirect(authUrl);

app.get('/userCallback', async(req, res) => {
    const { code } = req.query;
    const id = req.cookies.username;
    const { tokens } = await auth.getToken(code);
    google.options({ auth });
    wait sql`insert into googleoauth (authToken, id) values(${cryptoJS.AES.encrypt(JSON.stringify(tokens), id).toString()}, "nothing" )`;
    res.redirect("/");
});*/
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
app.get('/LIVRO/:placeholder', async(req, res) => {
    const placeholder = req.params.placeholder;
    fetch('https://ebjn.serveo.net/book-info', {
        method: "POST"
    })
    .then(data => data.json())
        .then(query => {
            query = query.filter(livro => livro.placeholder === placeholder);
            res.render('book', { placeholder, query });
    });
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
app.get('/IDADE/:idade', (req, res) => {
    const idade = req.params.idade;
    fetch('https://ebjn.serveo.net/book-info', {
        method: "POST"
    })
    .then(data => data.json())
        .then(query => {
            const moderatedBooks = query.filter(livro => livro.age === idade.toUpperCase());
            res.render(idade, { moderatedBooks });
    });
});
app.get('/book-list', (req, res) => {
    fetch('https://ebjn.serveo.net/book-info', {
        method: "POST"
    })
    .then(data => data.json())
        .then(query => {    
            res.send(query);
    });
});
app.get('/assets/:image', (req, res) => {
    const image = req.params.image;
    const archive = path.resolve(process.cwd(), `ASSETS/${image}`);
    res.sendFile(archive);
});
app.get('/cadastro', (req, res) => {
    const archive = path.resolve(process.cwd(), 'cadastro-tst.html');
    res.sendFile(archive);
});
app.get('/upload', (req, res) => {
    const archive = path.resolve(process.cwd(), 'upload.html');
    res.sendFile(archive);
});
app.get('/placar', async(req, res) => {
    const bookProgress = await sql`select * from bookprogress`;
    const userReadCounts = bookProgress.reduce((acc, curr) => {
        if (!acc[curr.email]) {
          acc[curr.email] = { email: curr.email, readedBooks: 0 };
        }
        acc[curr.email].readedBooks += 1;
        return acc;
    }, {});

    let ranking = Object.values(userReadCounts).sort((a, b) => b.readedBooks - a.readedBooks);

    const namePromises = ranking.map(user => 
        users.getNameByEmail(user.email, sql).then(name => ({
            name,
            email: user.email,
            readedBooks: user.readedBooks
        }))
    );

    Promise.all(namePromises)
        .then(ranking => {
            res.render('globalboard', { ranking });
        })
        .catch(err => {
            console.error("Error loading user names:", err);
            res.status(500).send("Error loading ranking.");
        });
});
app.get('/sobre', (req, res) => {
    const archive = path.resolve(process.cwd(), 'sobre.html');
    res.sendFile(archive);
});
app.post('/usuario', async(req, res) => {
    const usuario = req.body;
    const securePassword = await bcrypt.hash(usuario.password, 10);
    usuario.id = crypto.randomUUID();
    await sql`insert into users (id, name, email, password, serie) values(${usuario.id}, ${usuario.name}, ${usuario.email}, ${securePassword}, ${usuario.serie})`;
    if(usuario.type === 'contribuidores') {
        await sql`insert into specialaccounts (email, id, type) values (${usuario.email}, ${usuario.id}, ${usuario.type})`;
    }
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
        VALUES (${email[0].email}, ${query.id}, ${query.pageNumber}, ${query.placeholder}, ${new Date(query.date)})
        ON CONFLICT (email, placeholder) DO UPDATE
        SET page = ${query.pageNumber};
        `;
        console.log(query);
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
    if(query.operation == "is-contribuitor") {
        req.body.email = await users.getEmailBySessionId(req.body, sql);
        const result = await users.isContribuitor(req.body, sql);
        res.send({ result })
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
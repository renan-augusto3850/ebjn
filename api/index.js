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

//const ebjn = new ebjnDrive();
const app = express();
//const upload = multer();
app.use(express.json());
//app.use(cookieParser());

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

const smart = new SmartSDK();
let name;
const storage = multer.diskStorage({
    destination: "./temp",
    filename: (req, file, cb) => {
        name = smart.placeholdify(file.originalname);
        cb(null, smart.placeholdify(file.originalname))
    }
});
const upload = multer({storage});

const pdf = new pdfTools();

app.set('view engine', 'ejs');
app.set(path.resolve(process.cwd(), 'views'));

// Middleware to stop NProgress after route completes
app.use((req, res, next) => {
  res.on("finish", () => {
    NProgress.done();
  });
  next();
});

app.get('/', async(req, res) => {
    const query = [
        {
          title: 'Alice no país das maravilhas',
          placeholder: 'alice-no-pais-das-maravilhas',
          author: 'Lewis Carroll',
          aboutauthor: 'Charles Lutwidge Dodgson, mais conhecido pelo seu pseudônimo Lewis Carroll (Daresbury, 27 de janeiro de 1832 – Guildford, 14 de janeiro de 1898), foi um romancista, contista, fabulista, poeta, desenhista, fotógrafo, matemático e reverendo anglicano britânico. Lecionou matemática no Christ College, em Oxford. É autor do clássico livro Alice no País das Maravilhas, além de outros.',
          id: '4f4a54ce-b8ce-4054-bdcd-0e3a728b7198',
          authorpicture: 'https://th.bing.com/th/id/OIP.rNT-RoXZRksr9ZEm511q_gHaLR?rs=1&pid=ImgDetMain',
          medianindays: 9,
          pages: 171,
          age: 'L'
        },
        {
          title: 'Estilhaça-me',
          placeholder: 'estilhaca-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: '5d56f5f3-6269-40b7-b2a3-ae906abf3600',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 15,
          pages: 292,
          age: '14'
        },
        {
          title: 'Liberta-me',
          placeholder: 'liberta-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: '4bbb71b7-227d-448b-a9aa-f23471fee107',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 29,
          pages: 570,
          age: '14'
        },
        {
          title: 'Incedeia-me',
          placeholder: 'incedeia-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: '6fdf0952-258b-413d-b272-e4b419a57972',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 23,
          pages: 450,
          age: '14'
        },
        {
          title: 'Restaura-me',
          placeholder: 'restaura-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: '6e141361-0075-4847-8800-09837b62ed8b',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 14,
          pages: 276,
          age: '14'
        },
        {
          title: 'Desafia-me',
          placeholder: 'desafia-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: '32297ae6-a623-450c-9ebd-12bdf5417241',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 12,
          pages: 234,
          age: '14'
        },
        {
          title: 'Imagina-me',
          placeholder: 'imagina-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: 'd3626e44-8240-4eb2-b9eb-46094e7adf7d',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 10,
          pages: 196,
          age: '14'
        },
        {
          title: 'Decifra-me',
          placeholder: 'decifra-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: '06aa0704-99e1-4e8a-869d-726ff5b03bb6',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 7,
          pages: 131,
          age: '14'
        },
        {
          title: 'Unifica-me',
          placeholder: 'unifica-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: '8c8243c8-9698-4adf-a884-8774a54ce15d',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 8,
          pages: 157,
          age: '14'
        },
        {
          title: 'Aceita-me',
          placeholder: 'aceita-me',
          author: 'Taherem Mafi',
          aboutauthor: 'Tahereh Mafi é uma autora best-seller do New York Times e USA Today. Ela é conhecida por sua série de livros “Estilhaça-me”, que foi publicada em 22 países e vendeu mais de 150 mil exemplares apenas no Brasil.',
          id: '90cc3ed9-29dc-4ee9-8ce0-d923417bdc82',
          authorpicture: 'https://th.bing.com/th/id/OIP.isHosJN1E20j8KITG44b-QHaLH?rs=1&pid=ImgDetMain',
          medianindays: 7,
          pages: 133,
          age: '14'
        }
      ];
    res.render('index', { query });
});
app.get('/termos-de-servico', (req, res) => {
    const archive = path.resolve(process.cwd(), 'terms.html');
    res.sendFile(archive);
});
app.get('/IDADES/:age', (req, res) => {
    const age = req.params.age;
    const archive = path.resolve(process.cwd(), `AGES/${age}.html`);
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
app.post('/upload', upload.single('file'), async(req, res) => {
    console.log(req.body);
    pdf.convertToImages(`temp/${name}`, req.body.title);
    const sampleTitle = smart.placeholdify(req.body.title);
    console.log(sampleTitle);
    const totalPages = req.body.pages;
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    function calculateReadingTimeInDays(pages, readingSpeed) {
        // Assuming readingSpeed is in pages per minute
        const readingTimeMinutes = pages / readingSpeed;
        const totalMinutesPerDay = 60; // Adjust based on your daily reading time
        
        const totalDays = Math.ceil(readingTimeMinutes / totalMinutesPerDay);
        return totalDays;
    }
    
    
    const estimatedDays = calculateReadingTimeInDays(req.body.pages, 0.33);
    await sql`insert into books (title, author, placeholder, aboutauthor, authorpicture, id, medianindays, pages, age) values (${req.body.title}, ${req.body.author}, ${sampleTitle}, ${req.body.aboutauthor}, ${req.body.authorpicture},  ${randomUUID()}, ${estimatedDays}, ${totalPages}, ${req.body.age})`;
    
    res.redirect(`/LIVRO/${sampleTitle}`);
});
app.get('/LIVRO/:placeholder', async(req, res) => {
    const placeholder = req.params.placeholder;
    const query = await sql`select * from books where placeholder = ${placeholder}`;
    res.render('book', { placeholder, query });
});
app.post('/book-list', async(req, res) => {
    if(req.body.title) {
        res.send(await sql`select * from books where title = ${req.body.title}`);
    }else {
        res.send(await sql`select * from books`); 
    }
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
    const archive = path.resolve(process.cwd(), `ASSETS/${image}`);
    res.sendFile(archive);
});
app.get('/cadastro', (req, res) => {
    const archive = path.resolve(process.cwd(), 'cadastro.html');
    res.sendFile(archive);
});
app.get('/upload', (req, res) => {
    const archive = path.resolve(process.cwd(), 'upload.html');
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
import express from 'express';
import path from 'path';
import multer from 'multer';
import pdfTools from './api/pdfTools.js';
import fs from 'fs';
import SmartSDK from './smartSDK.js';
import pdfPageCounter from 'pdf-page-counter';
import postgres from 'postgres';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { randomUUID } from 'crypto';

dotenv.config();
const { NEW_PASSWORD } = process.env;

const sql = postgres({
    host: 'localhost',
    database: 'ebjn',
    username: 'postgres',
    password: NEW_PASSWORD,
    port: 5432,
});

const app = express();

app.set('view engine', 'ejs');
app.set(path.resolve(process.cwd(), 'views'));

const smart = new SmartSDK();
let name;
const storage = multer.diskStorage({
    destination: "./temp",
    filename: (req, file, cb) => {
        name = smart.placeholdify(file.originalname);
        cb(null, smart.placeholdify(file.originalname))
    }
});

const pdf = new pdfTools();

app.use(bodyParser.json());

const upload = multer({storage});
app.get('/', (req, res) => {
    const archive = path.resolve(process.cwd(), 'upload.html');
    res.sendFile(archive);
});
app.get('/temp/:pdf', (req, res) => {
    const archive = path.resolve(process.cwd(),"temp", req.params.pdf);
    res.sendFile(archive);
});
app.get('/assets/:image', (req, res) => {
    const image = req.params.image;
    const archive = path.resolve(process.cwd(), `ASSETS/${image}`);
    res.sendFile(archive);
});
app.post('/upload', upload.single('file'), async(req, res) => {
    console.log(req.body);
    pdf.convertToImages(`temp/${name}`, req.body.title);
    const sampleTitle = smart.placeholdify(req.body.title);
    console.log(sampleTitle);
    const totalPages = req.body.pages;
    let page = fs.readFileSync('./LIVRO/model-start.html', 'utf-8');
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    page += "<div id='flipbook'> \n";
    async function here() {
        page += `   <div><img class='page' src='/PAGES/${sampleTitle}/${sampleTitle + i}.png'></div> \n`;
        await sleep(100);
    }
    for(var i = 1; i < totalPages; i++){
       here().then();
    }
    page += fs.readFileSync('./LIVRO/model-end.html', 'utf-8');
    fs.writeFileSync(`./LIVRO/${sampleTitle}.html`, page, 'utf-8');
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
app.get('/LIVRO-ORIGINAL/:nome_do_livro', (req, res) => {
    const livro = req.params.nome_do_livro;
    const archive = path.resolve(process.cwd(), `temp/LIVRO/${livro}.html`);
    res.sendFile(archive);
});
app.get('/PAGES/:endereco/:page', (req, res) => {
    const add = req.params.endereco;
    const page = req.params.page;
    const archive = path.resolve(process.cwd(), `temp/PAGES/${add}/${page}`);
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
app.get('/LIVRO/:placeholder', async(req, res) => {
    const placeholder = req.params.placeholder;
    const query = await sql`select * from books where placeholder = ${placeholder}`;
    res.render('book', { placeholder, query });
});
app.post('/books', async(req, res) => {
    if(req.body.title) {
        res.send(await sql`select * from books where title = ${req.body.title}`);
    }else {
        res.send(await sql`select * from books`); 
    }
});
app.listen(3050, (err, address) => {
    if(err) {
        throw new Error("Server not inicialized");
    }
    console.log(`Rodando em porta 3050!`);
});
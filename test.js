import express from 'express';
import path from 'path';
import multer from 'multer';
import pdfTools from './api/pdfTools.js';
import fs from 'fs';
import SmartSDK from './smartSDK.js';
import pdfPageCounter from 'pdf-page-counter';

const app = express();
const smart = new SmartSDK();
let name;
const storage = multer.diskStorage({
    destination: "./temp",
    filename: (req, file, cb) => {
        name = file.originalname;
        cb(null, file.originalname)
    }
});

const pdf = new pdfTools();

const upload = multer({storage})
app.get('/', (req, res) => {
    const archive = path.resolve(process.cwd(), 'upload.html');
    res.sendFile(archive);
});
app.get('/temp/:pdf', (req, res) => {
    const archive = path.resolve(process.cwd(),"temp", req.params.pdf);
    res.sendFile(archive);
});
app.post('/upload', upload.single('file'), (req, res) => {
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
    fs.writeFileSync(`./temp/LIVRO/${sampleTitle}.html`, page, 'utf-8');
    res.redirect('/');
});
app.get('/LIVRO/:nome_do_livro', (req, res) => {
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
app.listen(3050, (err, address) => {
    if(err) {
        throw new Error("Server not inicialized");
    }
    console.log(`Rodando em porta 3050!`);
});
import express from 'express';
import path from 'path';

const app = express();

app.get('/', (req, res) => {
    const indexPath = path.resolve(process.cwd(), 'index.html');
    res.sendFile(indexPath);
});
app.get('/css', (req, res) => {
    const indexPath = path.resolve(process.cwd(), 'CSS/index.css');
    res.sendFile(indexPath);
});
app.get('/js', (req, res) => {
    const indexPath = path.resolve(process.cwd(), '/JS/index.js');
    res.sendFile(indexPath);
});
app.get('/LIVRO/:nome_do_livro', (req, res) => {
    const livro = req.params.nome_do_livro;
    const indexPath = path.resolve(process.cwd(), `/LIVRO/${livro}.html`);
    res.sendFile(indexPath);
});

app.get('/livrocss', (req, res) => {
    const indexPath = path.resolve(process.cwd(), '/CSS/livro.css');
    res.sendFile(indexPath);
});
app.get('/turn', (req, res) => {
    const indexPath = path.resolve(process.cwd(), '/JS/turn.js');
    res.sendFile(indexPath);
});
app.listen(3000, () => {
    console.log(`Rodando em porta 3000!`);
});
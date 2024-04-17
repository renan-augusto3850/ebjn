import express from 'express';
import path from 'path';

const app = express();

app.get('/', (req, res) => {
    const indexPath = path.resolve('index.html');
    res.sendFile(indexPath);
});
app.get('/css', (req, res) => {
    const indexPath = path.resolve('CSS/index.css');
    res.sendFile(indexPath);
});
app.get('/js', (req, res) => {
    const indexPath = path.resolve('JS/index.js');
    res.sendFile(indexPath);
});
app.get('/LIVRO/teste', (req, res) => {
    const indexPath = path.resolve('LIVRO/teste.html');
    res.sendFile(indexPath);
});
app.get('/livrocss', (req, res) => {
    const indexPath = path.resolve('CSS/livro.css');
    res.sendFile(indexPath);
});
app.get('/turn', (req, res) => {
    const indexPath = path.resolve('JS/turn.js');
    res.sendFile(indexPath);
});
app.listen(3000, () => {
    console.log(`Rodando em porta 3000!`);
});
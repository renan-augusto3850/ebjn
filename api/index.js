import express from 'express';
import path from 'path';

const app = express();

app.get('/', (req, res) => {
    const indexPath = path.resolve(process.cwd(), 'index.html');
    res.sendFile(indexPath);
});
app.get('/css/:stylesheet', (req, res) => {
    const stylesheet = req.params.stylesheet;
    const indexPath = path.resolve(process.cwd(), `CSS/${stylesheet}.css`);
    res.sendFile(indexPath);
});
app.get('/js/:script', (req, res) => {
    const script = req.params.script;
    const indexPath = path.resolve(process.cwd(), `JS/${script}.js`);
    res.sendFile(indexPath);
});
app.get('/LIVRO/:nome_do_livro', (req, res) => {
    const livro = req.params.nome_do_livro;
    const indexPath = path.resolve(process.cwd(), `LIVRO/${livro}.html`);
    res.sendFile(indexPath);
});
app.get('/cadastro', (req, res) => {
    const indexPath = path.resolve(process.cwd(), 'cadastro.html');
    res.sendFile(indexPath);
});
app.get('/manifest', (req, res) => {
    const indexPath = path.resolve(process.cwd(), 'MANIFEST/manifest.json');
    res.sendFile(indexPath);
});
app.get('/icon', (req, res) => {
    const indexPath = path.resolve(process.cwd(), 'ICON/Icon.png');
    res.sendFile(indexPath);
});
app.listen(3000, () => {
    console.log(`Rodando em porta 3000!`);
});
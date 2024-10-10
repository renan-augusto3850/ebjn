import express from 'express';
import path from 'path';
import postgres from 'postgres';
import 'dotenv/config';
import pageRange from '../pageRange.js';
import Users from './users.js';
import Books from './books.js';
import AuthService from './authService.js';

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

const usersService = new Users(sql);

const authService = new AuthService(sql);

const bookService = new Books(sql);

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
    res.send(await bookService.search(query.search));
});
app.get('/js/:script', (req, res) => {
    const script = req.params.script;
    const archive = path.resolve(process.cwd(), `JS/${script}.js`);
    res.sendFile(archive);
});
app.get('/PAGES/:endereco/:page', (req, res) => {
    const add = req.params.endereco;
    const page = req.params.page;
    const archive = path.resolve(process.cwd(), `PAGES/${add}/${page}`);
    res.sendFile(archive);
});
app.get('/espaco-escola/:page', async(req, res) => {
    const page = req.params.page;
    if(page === "pntsAcess") {
        const pnts = await sql`select * from donatedpnts`;
        res.render('pntsAcess', { pnts });
    } else{
        const archive = path.resolve(process.cwd(), `EDUCATOR-SPACE/${page}.html`);
        res.sendFile(archive);
    }
});
app.delete('/clearPNTS', async(req, res) => {
    await sql`delete from donatedpnts`;
    res.statusCode = 201;
    res.send(['ok']);
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
app.post('/book', async (req, res) => {
    const query = req.body;

    try {
        let result;
        switch (query.operation) {
            case "book-add":
                result = await bookService.addBook(query);
                break;
            case "book-get":
                result = await bookService.getBooks();
                break;
            case "book-delete":
                result = await bookService.deleteBook(query.title);
                break;
            case "book-consult-add":
                result = await bookService.addBookConsult(query);
                break;
            case "book-consult-get":
                result = await bookService.getBookConsults();
                break;
            case "book-consult-finish":
                result = await bookService.finishBookConsult(query.emailOrname);
                break;
            default:
                return res.status(400).send({ error: "Operação inválida" });
        }
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: "Erro interno do servidor" });
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
    const archive = path.resolve(process.cwd(), 'cadastro.html');
    res.sendFile(archive);
});
app.get('/upload', (req, res) => {
    const archive = path.resolve(process.cwd(), 'upload.html');
    res.sendFile(archive);
});
app.get('/placar', async (req, res) => {
    try {
        const bookProgress = await usersService.getBookProgress();
        const userReadCounts = bookProgress.reduce((acc, curr) => {
            if (!acc[curr.email]) {
                acc[curr.email] = { email: curr.email, readedBooks: 0 };
            }
            acc[curr.email].readedBooks += 1;
            return acc;
        }, {});

        let ranking = Object.values(userReadCounts).sort((a, b) => b.readedBooks - a.readedBooks);

        const namePromises = ranking.map(user =>
            usersService.getNameByEmail(user.email).then(name => ({
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
                res.status(500).send("Error loading ranking.");
            });
    } catch (error) {
        res.status(500).send("Error loading ranking.");
    }
});
app.get('/sobre', (req, res) => {
    const archive = path.resolve(process.cwd(), 'sobre.html');
    res.sendFile(archive);
});
app.post('/login', async (req, res) => {
    const { email, password, expireDate } = req.body;
    try {
        const user = await authService.getUserByEmail(email);
        if (!user.length) {
            return res.send({ "result": false });
        }

        const hashedPassword = user[0].password;
        const isPasswordValid = await authService.comparePasswords(password, hashedPassword);
        if (!isPasswordValid) {
            return res.send({ "result": false });
        }

        const id = crypto.randomUUID();
        await authService.createLoginSession(email, id, user[0].name, expireDate);
        res.send({ "result": true, id: id, name: user[0].name });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
app.post('/user', async (req, res) => {
    const query = req.body;

    switch (query.operation) {
        case "create-user":
            try {
                const result = await usersService.createUser(query);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Internal Server Error" });
                console.error(error);
            }
            break;
        case "read-update":
            await handleReadUpdate(query, res);
            break;
        case "read-get":
            await handleReadGet(query, res);
            break;
        case "read-finish":
            await handleReadFinish(query, res);
            break;
        case "pnts-get":
            await handlePntsGet(query, res);
            break;
        case "pnts-add":
            await handlePntsAdd(query, res);
            break;
        case "pnts-send":
            await handlePntsSend(query, res);
            break;
        case "is-contribuitor":
            await handleIsContribuitor(query, res);
            break;
        default:
            res.status(400).send({error: "Operação inválida"});
    }
});

async function handleReadUpdate(query, res) {
    const email = await usersService.getEmailBySessionId(query.id);
    await sql`INSERT INTO bookprogress (email, id, page, placeholder, date)
        VALUES (${email}, ${query.id}, ${query.pageNumber}, ${query.placeholder}, ${new Date(query.date)})
        ON CONFLICT (email, placeholder) DO UPDATE
        SET page = ${query.pageNumber}`;
    res.status(201).send({"Result": "ok"});
}

async function handleReadGet(query, res) {
    const email = await usersService.getEmailBySessionId(query.id);
    const page = await sql`select page from bookprogress where placeholder = ${query.placeholder} and email = ${email}`;
    res.send({result: "sucessfuly", page: page});
}

async function handleReadFinish(query, res) {
    const id = await usersService.getIdBySessionId(query.id);
    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
    const email = await usersService.getEmailBySessionId(query.id);
    const startDate = await sql`select date from bookprogress where email = ${email} and placeholder = ${query.placeholder}`;
    const medianReadDate = new Date(startDate[0].date.getTime() + query.medianInDays * umDiaEmMilissegundos).toISOString().slice(0, 10);
    
    if(query.finishDate != undefined) {
        const pnts = range.gerarPontuação(medianReadDate, query.finishDate);
        await sql`INSERT INTO pntstable (id, pnts)
            VALUES (${id}, ${pnts.toFixed(1)})
            ON CONFLICT (id)
            DO UPDATE
            SET pnts = pntstable.pnts + EXCLUDED.pnts`;
        res.send({"result": "sucessfuly", "pnts": pnts});
    } else {
        res.status(500).send({error: "Data de finalização inválida"});
    }
}

async function handlePntsGet(query, res) {
    const id = await usersService.getIdBySessionId(query.id);
    const pnts = await sql`select pnts from pntstable where id = ${id}`;
    res.send(pnts);
}

async function handlePntsAdd(query, res) {
    const id = await usersService.getIdBySessionId(query.id);
    await sql`INSERT INTO pntstable (id, pnts)
        VALUES (${id}, ${parseFloat(query.pnts)})
        ON CONFLICT (id)
        DO UPDATE
        SET pnts = pntstable.pnts + EXCLUDED.pnts`;
    res.send({result: "sucessfuly"});
}

async function handlePntsSend(query, res) {
    const id = await usersService.getIdBySessionId(query.id);
    query.id = id;
    await usersService.sendPNTS(query);
    res.status(200).send({result: "ok"});
}

async function handleIsContribuitor(query, res) {
    const result = await usersService.isContribuitor(query.id);
    const validUser = await usersService.isValidSessionId(query.id);
    res.send({result, logout: validUser});
}

app.get('/enviar-pnts', (req, res) => {
    res.render('points');
});
app.get('/login', (req, res) => {
    const archive = path.resolve(process.cwd(), 'login.html');
    res.sendFile(archive);
});
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
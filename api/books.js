export default class Books {
    constructor(sql) {
        this.sql = sql;
    }

    async search(query) {
        let filteredBook;
        return fetch('https://ebjn.serveo.net/books', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        })
        .then(data => data.json())
        .then(books => {
            filteredBook = books.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));
            return filteredBook;
        });
    }
    async addBook(book) {
        await this.sql`insert into booktables (title, author, placeholder, units) values(${book.title}, ${book.author}, ${book.placeholder}, ${book.units})`;
        return { result: "sucessfuly" };
    }
    async getBooks() {
        return await this.sql`select * from booktables`;
    }
    async deleteBook(title) {
        await this.sql`delete from booktables where title = ${title}`;
        return { result: "sucessfuly" };
    }
    async addBookConsult(consult) {
        await this.sql`insert into bookconsult (emailorname, placeholder, startdate, title, serie) values(${consult.emailOrname}, ${consult.placeholder}, ${consult.startDate}, ${consult.title}, ${consult.serie})`;
        return { result: "sucessfuly" };
    }
    async getBookConsults() {
        return await this.sql`select * from bookconsult`;
    }
    async finishBookConsult(emailOrname) {
        await this.sql`delete from bookconsult where emailorname = ${emailOrname}`;
        return { result: "sucessfuly" };
    }
}
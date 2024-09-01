export default class Books {
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
}

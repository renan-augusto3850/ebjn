fetch('https://weekly-grown-bug.ngrok-free.app/books', {
    headers: {
        "ngrok-skip-browser-warning": "84"
    }
}).then(data => data.text())
.then(text => console.log(text));
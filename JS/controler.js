if(cookie && cookie[1] == "Karla") {
    const name = cookie[1];
    document.querySelector("span").innerHTML = name;
    var smart = new SmartSDK();
    fetch('/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({operation: "book-get"})
    }).then(response => response.json())
        .then(result => {
            const table = document.getElementById('book-list');
            const options = document.getElementById('book-option');
            result.forEach( result => {
                let row = table.insertRow();
                let title = row.insertCell(0);
                title.innerHTML = result.title;
                let author = row.insertCell(1);
                author.innerHTML = result.author;
                let units = row.insertCell(2);
                units.innerHTML = result.units;
                let trash = row.insertCell(3);
                trash.innerHTML = `<buttton onclick="deleteBook('${result.title}')"><i class="fa-solid fa-trash"></i></button>`;
                options.innerHTML += `<option value="${result.title}">${result.title}</option>`;
            });
    }).catch(error => console.error(error));
    fetch('/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({operation: "book-consult-get"})
    }).then(response => response.json())
        .then(result => {
            const table = document.getElementById('consult-list');
            result.forEach( result => {
                let row = table.insertRow();
                let title = row.insertCell(0);
                title.innerHTML = result.title;
                let emailorname = row.insertCell(1);
                emailorname.innerHTML = result.emailorname;
                let startdate = row.insertCell(2);
                startdate.innerHTML = result.startdate;
                let finish = row.insertCell(3);
                finish.innerHTML = `<button onclick="finishConsult('${result.emailorname}')"><i class="fa-solid fa-check"></i></button>`;
            });
    }).catch(error => console.error(error));
    function finishConsult(emailOrname) {
        if(confirm("Tem certeza?")) {
            fetch('/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({operation: "book-consult-finish", emailOrname})
            });
            window.location.reload();
        }
    }
    function deleteBook(title) {
        if(confirm("Tem certeza?")) {
            fetch('/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({operation: "book-delete", title})
            });
            window.location.reload();
        }
    }
    document.getElementById('book-add').addEventListener('click', () => {
        document.getElementById('add-form').style.display = 'flex';
    });
    document.getElementById('book-consult').addEventListener('click', () => {
        document.getElementById('consult-form').style.display = 'flex';
    });
    document.getElementById('book-submit-form').addEventListener('click', () => {
        var title = document.getElementById('book-title-form').value;
        var author = document.getElementById('book-author-form').value;
        var units = document.getElementById('book-units-form').value;
        if(title && author && units) {
            if(confirm("Deseja contiuar?")){
                const query = {
                    operation: 'book-add',
                    title,
                    placeholder: smart.placeholdify(title),
                    author,
                    units: parseInt(units)
                };
                fetch('/book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(query)
                }).then(response => response.json())
                    .then(result => {
                        if(result.result != "sucessfuly") {
                        alert("Algo deu errado!");
                        }
                        console.clear();
                        document.getElementById('add-form').style.display = 'none';
                        window.location.reload();
                }).catch(error => console.error(error));
            }
        } else{
            alert("O formulario está vazio.");
            console.clear();
            document.getElementById('add-form').style.display = 'none';
            window.location.reload();
        }
    });
    document.getElementById('consult-submit-form').addEventListener('click', () => {
        var emailOrname = document.getElementById('consult-form-emailorname').value;
        var serie = document.getElementById('consult-form-serie').value;
        var title = document.getElementById('book-option');
        title = title.options[title.selectedIndex].value;
        if(emailOrname && title) {
            if(confirm("Deseja contiuar?")){
                const query = {
                    operation: 'book-consult-add',
                    emailOrname,
                    title,
                    serie,
                    placeholder: smart.placeholdify(title),
                    startDate: new Date().toISOString().split('T')[0]
                };
                fetch('/book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(query)
                }).then(response => response.json())
                    .then(result => {
                        if(result.result != "sucessfuly") {
                        alert("Algo deu errado!");
                        }
                        console.clear();
                        document.getElementById('consult-form').style.display = 'none';
                        window.location.reload();
                }).catch(error => console.error(error));
            }
        } else{
            alert("O formulario está vazio.");
            console.clear();
            document.getElementById('add-form').style.display = 'none';
        }
    });
} else{
    window.location.assign("/");
}
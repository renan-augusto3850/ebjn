function getMultiValueCookie(name) {
    const cookieArray = document.cookie.split('; ');
    console.log(cookieArray);   
    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].split('=');
        if (cookie[0] === name) {
            return cookie[1].split(',');
        }
    }
    return null;
}
function setCookie(name, value, daysToExpire, isHttpOnly) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);
    if(isHttpOnly === true){
        const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/; domain=renansites.rf.gd; HttpOnly;`;
        document.cookie = cookieValue;
        console.log("Secured HttpOnly cookie is created!");
    }
    else {
        const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/;`;  
        document.cookie = cookieValue;
    }
}
const voltar = document.getElementById('voltar');
voltar?.addEventListener('click', () => {
    voltar.animate([
        { left: '16px', offset: 0.25 },
        { left: '25px', offset: 0.50 },
        { left: '6px', offset: 0.75 },
        { left: '16px', offset: 1.0 }
    ], {
        duration: 300,
    });
    setTimeout(() => history.back(), 300);
});
// Cria a estrutura da barra de pesquisa
const searchBox = document.createElement('div');
searchBox.className = 'search-box';

const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.className = 'search-txt';
searchInput.id = 'search-input';
searchInput.placeholder = 'Pesquisar...';

const searchBtn = document.createElement('a');
searchBtn.href = '#';
searchBtn.className = 'search-btn';

const searchIcon = document.createElement('i');
searchIcon.className = 'search fa-solid fa-magnifying-glass';

// Monta a estrutura da barra de pesquisa
searchBtn.appendChild(searchIcon);
searchBox.appendChild(searchInput);
searchBox.appendChild(searchBtn);

// Insere o ícone antes do botão de Usuário
const userIcon = document.querySelector('#u');
userIcon.parentNode.insertBefore(searchBox, userIcon);

const cookie = getMultiValueCookie('username');
var pntsGlobal;
if(cookie) {
    document.querySelector('span').innerHTML = cookie[1];
    const userButton = document.getElementById('u');
    userButton.setAttribute('onclick', '');
    document.querySelector(".fa-user-plus").className = "fa-solid fa-user";
    
    fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({operation: "is-contribuitor", id: cookie[0]})
    }).then(response => response.json())
        .then(result => {
           if(result.result) {
            document.getElementById('user-data').innerHTML += '<br> <a href="https://ebjn.serveo.net" target="_blank" class="simple-link">Cadastrar livros.</a>';
           } else{
            setCookie('username', 'invalid', -3, false);
            window.location.assign('/login');
           }
    }).catch(error => console.error(error));

    fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({operation: "pnts-get", id: cookie[0]})
    }).then(response => response.json())
        .then(result => {
            console.log(result.result);
            if(result[0].pnts){
                document.getElementById('pnts').innerHTML = `<i class="fa-solid fa-circle-half-stroke"></i>${result[0].pnts} Pnts.`;
                pntsGlobal = parseFloat(result[0].pnts);
            }
    }).catch(error => console.error(error));

}

document.getElementById('open-menu').addEventListener('click', () => {
    document.body.style.overflowY = 'hidden';
    document.getElementById('menu').style.left = '0';
});

document.getElementById('close-menu').addEventListener('click', () => {
    document.body.style.overflowY = 'auto';
    document.getElementById('menu').style.left = '-100%';
});
document.getElementById('search-input').addEventListener('input', (e) => {
    fetch('/search', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({search: e.target.value.toLowerCase()})
    }).then(response => response.json())
        .then(results => {
            let page;
            results.forEach(book => {
                page += `
                <div><img src='https://ebjn.serveo.net/PAGES/${book.placeholder}/${book.placeholder}1.png'> <div style='display: block;'><h2>${book.title}</h2> <h3>${book.author}</h3> <a class='simple-link' href='/LIVRO/${book.placeholder}'>Ler ></a></div></div>'>
                `;
            });
            let searchPredictions = document.querySelector('.search-predictions');
            searchPredictions.innerHTML = page;
        });
});
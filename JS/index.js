function getMultiValueCookie(name) {
    const cookieArray = document.cookie.split('; ');
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
    if (isHttpOnly === true) {
        const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/; domain=renansites.rf.gd; HttpOnly;`;
        document.cookie = cookieValue;
        console.log("Secured HttpOnly cookie is created!");
    } else {
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

document.getElementById('search-input')?.addEventListener('input', (e) => {
    fetch('/search', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: e.target.value.toLowerCase() })
    }).then(response => response.json())
        .then(results => {
            let page = ''; // Inicializa a variável 'page'
            results.forEach(book => {
                page += `
                <div>
                    <img src='https://ebjn.serveo.net/PAGES/${book.placeholder}/${book.placeholder}1.png'> 
                    <div style='display: block;'>
                        <h2>${book.title}</h2> 
                        <h3>${book.author}</h3> 
                        <a class='simple-link' href='/LIVRO/${book.placeholder}'>Ler ></a>
                    </div>
                </div>`;
            });
            const searchPredictions = document.querySelector('.search-predictions');
            searchPredictions.innerHTML = page;
        }).catch(error => console.error('Erro ao buscar resultados:', error));
});

// Mostra previsões ao focar no campo de pesquisa
//const searchInputEl = document?.getElementById('search-box');
//const searchPredictionsEl = document.querySelector('.search-predictions');

//Causa conflitos com o CSS:
// searchInputEl?.addEventListener('focusin', () => {
//     searchPredictionsEl.style.display = 'block';
// });

// // Esconde previsões ao clicar fora
// document.addEventListener('click', (event) => {
//     const searchBox = document.querySelector('.search-box');
//     if (!searchBox.contains(event.target) && !searchPredictionsEl.contains(event.target)) {
//         searchPredictionsEl.style.display = 'none';
//     }
// });

const cookie = getMultiValueCookie('username');
var pntsGlobal;
if (cookie) {
    document.querySelector('span').innerHTML = cookie[1];
    const userButton = document.getElementById('u');
    userButton.setAttribute('onclick', '');
    document.querySelector(".fa-user-plus").className = "fa-solid fa-user";

    fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ operation: "is-contribuitor", id: cookie[0] })
    }).then(response => response.json())
        .then(result => {
            if (result.result) {
                document.getElementById('user-data').innerHTML += '<br> <a href="https://ebjn.serveo.net" target="_blank" class="simple-link">Cadastrar livros.</a>';
            }
            if (result.logout) {
                setCookie('username', 'invalid', -3, false);
                window.location.assign('/login');
            }
        }).catch(error => console.error(error));

    fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ operation: "pnts-get", id: cookie[0] })
    }).then(response => response.json())
        .then(result => {
            console.log(result.result);
            if (result[0].pnts) {
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

document.getElementById('logout').addEventListener('click', () => {
    setCookie('username', 'invalid', -3, false);
    window.location.reload();
});
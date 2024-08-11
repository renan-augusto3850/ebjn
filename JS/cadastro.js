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
let type = 'leitores';
document.getElementById('cadastrar').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    const name = document.getElementById('name').value;
    const serie = document.getElementById('serie').value;
    const data = {email, password, name, serie, type};
    console.log(data);
    fetch('/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(result => {
            console.log(result.result);
            if(result.result === 'sucessfuly') {
                const data = {email: email, password: password, operation: 'enter'};
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(response => response.json())
                    .then(result => {
                        console.log(result.result);
                        if(result.result != false) {
                            console.log(result);
                            setCookie('username', result.id + ',' + result.name, 50, false);
                            window.location.assign('/');
                        } else{
                            alert("Email ou senha invalida!");
                        }
                }).catch(error => console.error(error));
            }
    }).catch(error => console.error(error));
});
const divTipos = document.getElementById('type-users');
divTipos.addEventListener('click', (e) => {
    if(e.target.className === 'box') {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        type = e.target.id;
        console.log(type);
    }
});
const voltar = document.getElementById('voltar');
voltar.addEventListener('click', () => {
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
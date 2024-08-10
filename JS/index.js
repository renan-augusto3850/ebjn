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
const cookie = getMultiValueCookie('username');
if(cookie) {
    document.querySelector('.fa-user-plus').className = 'fa-solid fa-user';
    document.querySelector('span').innerHTML = cookie[1];
    const userButton = document.getElementById('u');
    const userDataPanel = document.getElementById('user-data');
    userButton.setAttribute('onclick', '');
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
            }
    }).catch(error => console.error(error));
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
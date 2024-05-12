function getMultiValueCookie(name) {
    const cookieArray = document.cookie.split(', ');
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
    const userButton = document.getElementById('u');
    userButton.setAttribute('onclick', '');
    userButton.addEventListener('click', () => {
        console.log("teste");
    });

}
document.getElementById('open-menu').addEventListener('click', () => {
    document.body.style.overflowY = 'hidden';
    document.getElementById('menu').style.left = '0';
});
document.getElementById('close-menu').addEventListener('click', () => {
    document.body.style.overflowY = 'auto';
    document.getElementById('menu').style.left = '-100%';
});
document.getElementById('abrir-es5g52jye').addEventListener('click', ()=> {
    document.getElementById('es5g52jye').style.display = 'block';
});
document.getElementById('fechar-es5g52jye').addEventListener('click', ()=> {
    document.getElementById('es5g52jye').style.display = 'none';
});
document.getElementById('abrir-mgeuvvebd').addEventListener('click', ()=> {
    document.getElementById('mgeuvvebd').style.display = 'block';
});
document.getElementById('fechar-mgeuvvebd').addEventListener('click', ()=> {
    document.getElementById('mgeuvvebd').style.display = 'none';
});
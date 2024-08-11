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
const cookie = getMultiValueCookie('username');
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
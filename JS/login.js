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
document.getElementById('cadastrar').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
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
});
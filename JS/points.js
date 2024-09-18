document.getElementById('send-pnts').addEventListener('click', () => {
    const subject = document.getElementById('subject').value;
    const pnts = parseFloat(document.getElementById('pnts-form').value);
    const serie = document.getElementById('serie').value;
    console.log(serie);
    const cookie = getMultiValueCookie('username');
    if(subject && pnts && serie && cookie) {
        if(pnts < pntsGlobal) {
            if(confirm("Tem certeza que deseja enviar seus PNTS?")) {
                fetch('/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({operation: 'pnts-send', subject, pnts: pnts, serie, id: cookie[0], name: cookie[1]})
                });
                window.location.assign('/');
            }
        } else{
            alert("A quantidade de PNTS digitada é maior da que você tem.");
        }
    } else{
        alert("Preencha todos os dados corretamente");
    }
    
});
document.getElementById('limpar').addEventListener('click', () => {
    if(confirm("Você têm certeza que deseja resetar a contagem de PNTS?")) {
        fetch('/clearPNTS', {
            method: 'DELETE'
        }).then(() => {
            window.location.reload();
        });
    }
});
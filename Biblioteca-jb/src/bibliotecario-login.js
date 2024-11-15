import API_BASE_URL from "./config.js";

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            alert('Erro: ' + data.erro)
        } else {
            // Armazenar a informação de que o bibliotecário está logado
            localStorage.setItem('bibliotecarioLogado', true)
            localStorage.setItem('bibliotecarioId', data.id)
            window.location.href = './bibliotecario.html'
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error)
    })
})

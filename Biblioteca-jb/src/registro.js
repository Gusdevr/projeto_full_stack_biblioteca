import API_BASE_URL from "./config.js";

document.addEventListener('DOMContentLoaded', function () {
    const registroForm = document.getElementById('registroForm');

    if (registroForm) {
        registroForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Obter os valores do formulário
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            // Objeto para o registro do usuário
            const usuario = { nome, email, senha };

            fetch(`${API_BASE_URL}/registrar`, { // Substituição pela variável API_BASE_URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro no registro: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.erro) {
                        alert('Erro ao registrar: ' + data.erro);
                    } else {
                        alert('Usuário registrado com sucesso! Redirecionando para a página de login.');
                        window.location.href = './login.html';
                    }
                })
                .catch(error => {
                    console.error('Erro ao registrar usuário:', error);
                    alert('Erro ao registrar usuário: ' + error.message);
                });
        });
    } else {
        console.error('Formulário de registro não encontrado!');
    }
});

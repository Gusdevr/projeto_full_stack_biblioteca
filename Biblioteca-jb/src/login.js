import API_BASE_URL from "./config.js";

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Obter valores do formulário
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            // Verificar se campos estão preenchidos
            if (!email || !senha) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const dados = { email, senha };

            try {
                // Fazer requisição de login
                const response = await fetch(`${API_BASE_URL}/login`, { // Usando API_BASE_URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dados),
                });

                // Verificar se o login foi bem-sucedido
                if (response.ok) {
                    const usuario = await response.json();

                    // Armazenar informações do usuário no localStorage
                    localStorage.setItem('usuarioId', usuario.id);
                    localStorage.setItem('nomeUsuario', usuario.nome);

                    // Redirecionar para a página de usuário
                    window.location.href = './usuario.html';
                } else {
                    // Tratar erros de login
                    const errorData = await response.json();
                    alert(`Erro ao fazer login: ${errorData.erro}`);
                }
            } catch (error) {
                // Tratar erros de conexão com a API
                alert(`Erro ao conectar com a API: ${error.message}`);
            }
        });
    } else {
        console.error('Formulário de login não encontrado!');
    }
});

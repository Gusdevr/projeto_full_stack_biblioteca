import API_BASE_URL from "./config.js";

document.addEventListener('DOMContentLoaded', function () {
    const registroForm = document.getElementById('registroForm');

    if (registroForm) {
        registroForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Obter os valores do formulário
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const masp = document.getElementById('masp').value;

            // Objeto bibliotecário
            const bibliotecario = { nome, email, senha, masp };

            try {
                // Requisição para registrar o bibliotecário
                const response = await fetch(`${API_BASE_URL}/registrar-bibliotecario`, { // Alterado para usar API_BASE_URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bibliotecario),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registro realizado com sucesso!');
                    window.location.href = './bibliotecario-login.html';
                } else {
                    alert('Erro ao registrar: ' + data.erro);
                }
            } catch (error) {
                console.error('Erro ao registrar:', error);
                alert('Erro ao registrar: ' + error.message);
            }
        });
    } else {
        console.error('Formulário de registro não encontrado!');
    }
});

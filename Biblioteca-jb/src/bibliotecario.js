import API_BASE_URL from "./config.js";

document.addEventListener('DOMContentLoaded', function() {
    const adicionarLivroForm = document.getElementById('adicionarLivroForm');
    const emprestimosList = document.getElementById('emprestimosList');
    const logoutBtn = document.getElementById('logoutBtn');

    // Verificar se o bibliotecário está logado
    const isLoggedIn = localStorage.getItem('bibliotecarioLogado');
    if (!isLoggedIn) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = './bibliotecario-login.html';
        return;
    }

    // Logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('bibliotecarioLogado');
        localStorage.removeItem('bibliotecarioId');
        alert('Você foi desconectado!');
        window.location.href = './bibliotecario-login.html';
    });

    // Adicionar Livro
    adicionarLivroForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('titulo', document.getElementById('titulo').value);
        formData.append('autor', document.getElementById('autor').value);
        formData.append('quantidade', document.getElementById('quantidade').value);
        formData.append('editora', document.getElementById('editora').value);
        formData.append('assunto', document.getElementById('assunto').value);
        formData.append('faixaEtaria', document.getElementById('faixaEtaria').value);
        formData.append('imagem', document.getElementById('imagem').files[0]);

        fetch(`${API_BASE_URL}/livros`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('Erro ao adicionar livro: ' + data.erro);
            } else {
                alert('Livro adicionado com sucesso!');
                adicionarLivroForm.reset();
            }
        })
        .catch(error => console.error('Erro ao adicionar livro:', error));
    });

    // Carregar Empréstimos
    function carregarEmprestimos() {
        fetch(`${API_BASE_URL}/livros-alugados`)
            .then(response => response.json())
            .then(emprestimos => {
                emprestimosList.innerHTML = '';
                emprestimos.forEach(emprestimo => {
                    const li = document.createElement('li');
                    li.textContent = `${emprestimo.Livro.titulo} - ${emprestimo.Usuario.nome} (Expira: ${new Date(emprestimo.data_vencimento).toLocaleDateString()})`;

                    const emailBtn = document.createElement('button');
                    emailBtn.textContent = 'Enviar Email';
                    emailBtn.addEventListener('click', () => enviarEmail(emprestimo.Usuario.email, emprestimo.Livro.titulo, emprestimo.data_vencimento));
                    li.appendChild(emailBtn);

                    emprestimosList.appendChild(li);
                });
            })
            .catch(error => console.error('Erro ao carregar empréstimos:', error));
    }

    function enviarEmail(email, livroTitulo, dataVencimento) {
        const mensagem = `Lembrete: O livro "${livroTitulo}" que você alugou expira em ${new Date(dataVencimento).toLocaleDateString()}.`;

        fetch(`${API_BASE_URL}/enviar-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, mensagem }),
        })
        .then(response => response.json())
        .then(data => {
            alert('Email enviado com sucesso!');
        })
        .catch(error => console.error('Erro ao enviar email:', error));
    }

    carregarEmprestimos();
});

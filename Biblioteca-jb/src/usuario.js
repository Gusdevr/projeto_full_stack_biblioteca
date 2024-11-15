import API_BASE_URL from "./config.js";

document.addEventListener('DOMContentLoaded', function () {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const usuarioId = localStorage.getItem('usuarioId');
    const logoutBtn = document.getElementById('logoutBtn');

    // Verificar se as informações do usuário estão disponíveis
    if (!usuarioId || !nomeUsuario) {
        // Se não houver usuário logado, redirecionar para a página de login
        alert('Você não está logado. Redirecionando para a página de login.');
        window.location.href = './login.html';
    } else {
        // Exibir o nome do usuário logado
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    // Adicionar evento de logout
    logoutBtn.addEventListener('click', function () {
        // Limpar as informações do localStorage
        localStorage.clear();

        // Redirecionar o usuário para a página de login
        alert('Logout realizado com sucesso!');
        window.location.href = './login.html';
    });

    // Funções para carregar os livros disponíveis e os empréstimos do usuário logado
    carregarLivrosDisponiveis();
    carregarEmprestimos(usuarioId);
});

function carregarEmprestimos(usuarioId) {
    fetch(`${API_BASE_URL}/usuario/${usuarioId}/emprestimos`) // Substituído pela variável API_BASE_URL
        .then(res => res.json())
        .then(emprestimos => {
            const listaAlugados = document.getElementById('listaAlugados');
            listaAlugados.innerHTML = '';

            if (emprestimos.length === 0) {
                listaAlugados.innerHTML = '<li>Nenhum livro alugado.</li>';
            } else {
                emprestimos.forEach(emprestimo => {
                    const dataVencimento = new Date(emprestimo.data_vencimento);
                    listaAlugados.innerHTML += `
                        <li>
                            <strong>${emprestimo.Livro.titulo}</strong> - Devolução em: ${dataVencimento.toLocaleDateString()} <br>
                            <button onclick="devolverLivro(${emprestimo.id})">Devolver</button>
                            <button onclick="renovarLivro(${emprestimo.id})">Renovar</button>
                        </li>
                    `;
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar livros alugados:', error);
            document.getElementById('listaAlugados').innerHTML = '<li>Erro ao carregar livros alugados.</li>';
        });
}

function devolverLivro(emprestimoId) {
    const usuarioId = localStorage.getItem('usuarioId');

    fetch(`${API_BASE_URL}/devolver/${emprestimoId}`, {  // Substituído pela variável API_BASE_URL
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            alert('Erro ao devolver o livro: ' + data.erro);
        } else {
            alert('Livro devolvido com sucesso!');
            carregarEmprestimos(usuarioId);  // Atualiza a lista de empréstimos
        }
    })
    .catch(error => {
        console.error('Erro ao devolver o livro:', error);
    });
}

function carregarLivrosDisponiveis() {
    fetch(`${API_BASE_URL}/livros`) // Substituído pela variável API_BASE_URL
        .then(res => res.json())
        .then(livros => {
            const listaLivros = document.getElementById('listaLivros');
            listaLivros.innerHTML = '';

            if (livros.length === 0) {
                listaLivros.innerHTML = '<li>Nenhum livro disponível no momento.</li>';
            } else {
                livros.forEach(livro => {
                    listaLivros.innerHTML += `
                        <li>
                            <strong>${livro.titulo}</strong> por ${livro.autor} <br>
                            Quantidade disponível: ${livro.quantidade} <br>
                            <button onclick="alugarLivro(${livro.id})">Alugar</button>
                        </li>
                    `;
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar livros:', error);
            document.getElementById('listaLivros').innerHTML = '<li>Erro ao carregar livros.</li>';
        });
}

function alugarLivro(livroId) {
    const usuarioId = localStorage.getItem('usuarioId');

    fetch(`${API_BASE_URL}/alugar`, { // Substituído pela variável API_BASE_URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuarioId, livroId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            alert('Erro: ' + data.erro);
        } else {
            alert('Livro alugado com sucesso!');
            carregarLivrosDisponiveis();
            carregarEmprestimos(usuarioId);
        }
    })
    .catch(error => {
        console.error('Erro ao alugar livro:', error);
    });
}

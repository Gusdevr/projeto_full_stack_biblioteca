import API_BASE_URL from "./config.js"; // O import deve estar no topo do arquivo

document.addEventListener("DOMContentLoaded", function () {
  const loadBooksBtn = document.getElementById("loadBooksBtn");
  const cardsContainer = document.getElementById("cardsContainer");

  function carregarLivros() {
    fetch(`${API_BASE_URL}/livros`) // Agora usando a URL base importada
      .then((response) => response.json())
      .then((livros) => {
        cardsContainer.innerHTML = "";

        if (livros.length === 0) {
          cardsContainer.innerHTML =
            "<p>Nenhum livro disponível no momento.</p>";
        } else {
          livros.forEach((livro) => {
            const card = document.createElement("div");
            card.classList.add("card");

            const imagemSrc = livro.imagem
              ? `${API_BASE_URL}/img/capas-livro/${livro.imagem}`
              : `${API_BASE_URL}/img/default-cover.jpg`;

            card.innerHTML = `
              <img src="${imagemSrc}" alt="Capa do Livro" class="livro-img">
              <h3>${livro.titulo}</h3>
              <p><strong>Autor:</strong> ${livro.autor}</p>
              <p><strong>Editora:</strong> ${livro.editora}</p>
              <p><strong>Descrição:</strong> ${livro.assunto}</p>
              <div class="button-card">
                <button onclick="alugarLivro(${livro.id})">Alugar</button>
              </div>
            `;

            cardsContainer.appendChild(card);
          });
        }
      })
      .catch((error) => console.error("Erro ao carregar livros:", error));
  }

  loadBooksBtn.addEventListener("click", carregarLivros);

  window.alugarLivro = function (livroId) {
    const usuarioId = localStorage.getItem("usuarioId");
    if (usuarioId) {
      window.location.href = `./usuario.html?livroId=${livroId}`;
    } else {
      window.location.href = "./login.html";
    }
  };
});

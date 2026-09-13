let token = localStorage.getItem("token");

/* CADASTRAR USUÁRIO */
async function cadastrarUsuario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  const resposta = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      email,
      senha,
    }),
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    alert("Usuário cadastrado com sucesso!");
  } else {
    alert(dados.erro);
  }
}

/* LOGIN */
async function fazerLogin() {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  const resposta = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    token = dados.token;

    localStorage.setItem("token", token);

    document.getElementById("statusLogin").innerText = "Usuário autenticado";

    alert("Login realizado com sucesso!");
  } else {
    alert(dados.erro);
  }
}

/* SAIR */
function sair() {
  token = null;

  localStorage.removeItem("token");

  document.getElementById("statusLogin").innerText = "Usuário não autenticado";

  alert("Usuário desconectado.");
}

/* CADASTRAR LIVRO */
async function cadastrarLivro() {
  if (!token) {
    alert("Faça login antes de cadastrar um livro.");
    return;
  }

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const categoria = document.getElementById("categoria").value;
  const ano = document.getElementById("ano").value;
  const quantidade = document.getElementById("quantidade").value;

  const resposta = await fetch("/livros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      titulo,
      autor,
      categoria,
      ano_publicacao: Number(ano),
      quantidade_total: Number(quantidade),
      quantidade_disponivel: Number(quantidade),
    }),
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    alert("Livro cadastrado com sucesso!");

    limparFormularioLivro();

    carregarLivros();
  } else {
    alert(dados.erro);
  }
}

/* LISTAR LIVROS */
async function carregarLivros() {
  const resposta = await fetch("/livros");

  const livros = await resposta.json();

  const lista = document.getElementById("listaLivros");

  lista.innerHTML = "";

  if (livros.length === 0) {
    lista.innerHTML = "<p>Nenhum livro cadastrado.</p>";
    return;
  }

  livros.forEach((livro) => {
    const div = document.createElement("div");

    div.className = "livro";

    div.innerHTML = `
            <h3>${livro.titulo}</h3>

            <p>
                <strong>Autor:</strong>
                ${livro.autor}
            </p>

            <p>
                <strong>Categoria:</strong>
                ${livro.categoria || ""}
            </p>

            <p>
                <strong>Ano:</strong>
                ${livro.ano_publicacao || ""}
            </p>

            <p>
                <strong>Quantidade disponível:</strong>
                ${livro.quantidade_disponivel}
            </p>

            <button onclick="editarLivro('${livro._id}')">
                Editar
            </button>

            <button onclick="excluirLivro('${livro._id}')">
                Excluir
            </button>
        `;

    lista.appendChild(div);
  });
}

/* EDITAR LIVRO */
async function editarLivro(id) {
  if (!token) {
    alert("Faça login primeiro.");
    return;
  }

  const titulo = prompt("Digite o novo título:");

  if (!titulo) {
    return;
  }

  const autor = prompt("Digite o novo autor:");

  if (!autor) {
    return;
  }

  const resposta = await fetch("/livros/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      titulo,
      autor,
    }),
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    alert("Livro atualizado com sucesso!");

    carregarLivros();
  } else {
    alert(dados.erro);
  }
}

/* EXCLUIR LIVRO */
async function excluirLivro(id) {
  if (!token) {
    alert("Faça login primeiro.");
    return;
  }

  const confirmar = confirm("Deseja realmente excluir este livro?");

  if (!confirmar) {
    return;
  }

  const resposta = await fetch("/livros/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    alert("Livro removido com sucesso!");

    carregarLivros();
  } else {
    alert(dados.erro);
  }
}

/* LIMPAR CAMPOS */
function limparFormularioLivro() {
  document.getElementById("titulo").value = "";
  document.getElementById("autor").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("ano").value = "";
  document.getElementById("quantidade").value = "";
}

/* VERIFICAR LOGIN AO ABRIR A PÁGINA */
if (token) {
  document.getElementById("statusLogin").innerText = "Usuário autenticado";
}

/* CARREGAR LIVROS AO ABRIR */
carregarLivros();

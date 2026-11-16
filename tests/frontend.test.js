/**
 * @jest-environment jsdom
 */

describe("Testes do Front-end da Biblioteca Online", () => {
  let frontend;

  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();

    document.body.innerHTML = `
      <p id="statusLogin">Usuário não autenticado</p>

      <input id="nome" />
      <input id="emailCadastro" />
      <input id="senhaCadastro" />

      <input id="emailLogin" />
      <input id="senhaLogin" />

      <input id="titulo" />
      <input id="autor" />
      <input id="categoria" />
      <input id="ano" />
      <input id="quantidade" />

      <div id="listaLivros"></div>
    `;

    global.alert = jest.fn();
    global.fetch = jest.fn();

    frontend = require("../biblioteca_online/public/app.js");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Deve realizar login e armazenar o token", async () => {
    document.getElementById("emailLogin").value = "teste@example.com";
    document.getElementById("senhaLogin").value = "senhaTeste";

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token: "token-teste" }),
    });

    await frontend.fazerLogin();

    expect(localStorage.getItem("token")).toBe("token-teste");

    expect(document.getElementById("statusLogin").innerText).toBe(
      "Usuário autenticado",
    );
  });

  test("Deve realizar logout e remover o token", () => {
    localStorage.setItem("token", "token-teste");

    frontend.sair();

    expect(localStorage.getItem("token")).toBeNull();

    expect(document.getElementById("statusLogin").innerText).toBe(
      "Usuário não autenticado",
    );
  });

  test("Deve impedir cadastro de livro sem login", async () => {
    await frontend.cadastrarLivro();

    expect(global.fetch).not.toHaveBeenCalled();

    expect(global.alert).toHaveBeenCalledWith(
      "Faça login antes de cadastrar um livro.",
    );
  });

  test("Deve mostrar mensagem quando não existem livros", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await frontend.carregarLivros();

    expect(document.getElementById("listaLivros").innerHTML).toContain(
      "Nenhum livro cadastrado.",
    );
  });

  test("Deve limpar os campos do formulário", () => {
    const campos = ["titulo", "autor", "categoria", "ano", "quantidade"];

    campos.forEach((id) => {
      document.getElementById(id).value = "Teste";
    });

    frontend.limparFormularioLivro();

    campos.forEach((id) => {
      expect(document.getElementById(id).value).toBe("");
    });
  });
});

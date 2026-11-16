const validarLivro = require("../biblioteca_online/src/utils/validarLivro");

describe("Testes unitários - Validação de Livros", () => {
  test("Deve aceitar um livro com título e autor", () => {
    const livro = {
      titulo: "Desenvolvimento Web",
      autor: "Autor Teste",
    };

    const resultado = validarLivro(livro);

    expect(resultado.valido).toBe(true);
    expect(resultado.erro).toBeNull();
  });

  test("Deve rejeitar um livro sem título", () => {
    const livro = {
      autor: "Autor Teste",
    };

    const resultado = validarLivro(livro);

    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe("Título e autor são obrigatórios");
  });

  test("Deve rejeitar um livro sem autor", () => {
    const livro = {
      titulo: "Desenvolvimento Web",
    };

    const resultado = validarLivro(livro);

    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toBe("Título e autor são obrigatórios");
  });
});

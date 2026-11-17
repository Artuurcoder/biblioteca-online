const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "chave-exclusiva-para-testes-automatizados";

// Simula o model Livro sem acessar o MongoDB real

jest.mock("../biblioteca_online/models/Livro", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
}));

const Livro = require("../biblioteca_online/models/Livro");
const app = require("../biblioteca_online/src/app");

describe("Testes da API Biblioteca Online", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE 1 - ACESSO À LISTA DE USUÁRIOS SEM TOKEN
  test("Deve impedir acesso à lista de usuários sem token", async () => {
    const resposta = await request(app).get("/usuarios");

    expect(resposta.statusCode).toBe(401);
    expect(resposta.body.erro).toBe("Token não informado ou formato inválido");
  });

  // TESTE 2 - LISTAR LIVROS
  test("Deve listar os livros com sucesso", async () => {
    Livro.find.mockResolvedValue([
      {
        titulo: "Livro de Teste",
        autor: "Autor de Teste",
      },
    ]);

    const resposta = await request(app).get("/livros");

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].titulo).toBe("Livro de Teste");
  });

  // TESTE 3 - LIVRO INEXISTENTE
  test("Deve retornar 404 para livro inexistente", async () => {
    Livro.findById.mockResolvedValue(null);

    const resposta = await request(app).get("/livros/507f1f77bcf86cd799439011");

    expect(resposta.statusCode).toBe(404);
    expect(resposta.body.erro).toBe("Livro não encontrado");
  });

  // TESTE 4 - CADASTRO SEM AUTENTICAÇÃO
  test("Deve impedir cadastro de livro sem token", async () => {
    const resposta = await request(app).post("/livros").send({
      titulo: "Novo Livro",
      autor: "Autor Teste",
    });

    expect(resposta.statusCode).toBe(401);
    expect(resposta.body.erro).toBe("Token não informado ou formato inválido");
  });

  // TESTE 5 - CADASTRO COM DADOS VÁLIDOS
  test("Deve cadastrar um livro com dados válidos", async () => {
    const token = jwt.sign({ id: "usuario-teste" }, process.env.JWT_SECRET);

    const novoLivro = {
      titulo: "Desenvolvimento Web",
      autor: "Autor Teste",
    };

    Livro.create.mockResolvedValue(novoLivro);

    const resposta = await request(app)
      .post("/livros")
      .set("Authorization", `Bearer ${token}`)
      .send(novoLivro);

    expect(resposta.statusCode).toBe(201);
    expect(resposta.body.titulo).toBe("Desenvolvimento Web");
    expect(Livro.create).toHaveBeenCalledTimes(1);
  });

  // TESTE - ATUALIZAÇÃO COM CAMPO NÃO AUTORIZADO
  test("Deve ignorar campos não permitidos na atualização", async () => {
    const token = jwt.sign({ id: "usuario-teste" }, process.env.JWT_SECRET);

    Livro.findByIdAndUpdate.mockResolvedValue({
      titulo: "Livro Atualizado",
      autor: "Autor Teste",
    });

    await request(app)
      .put("/livros/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Livro Atualizado",
        _id: "id-nao-autorizado",
      });

    const dadosEnviados = Livro.findByIdAndUpdate.mock.calls[0][1];

    expect(dadosEnviados.$set).toEqual({
      titulo: "Livro Atualizado",
    });

    expect(dadosEnviados.$set._id).toBeUndefined();
  });

  // TESTE - ATUALIZAÇÃO SEM CAMPOS PERMITIDOS
  test("Deve rejeitar atualização sem campos permitidos", async () => {
    const token = jwt.sign({ id: "usuario-teste" }, process.env.JWT_SECRET);

    const resposta = await request(app)
      .put("/livros/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`)
      .send({
        _id: "id-nao-autorizado",
      });

    expect(resposta.statusCode).toBe(400);

    expect(Livro.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  // TESTE 6 - CADASTRO COM DADOS INCOMPLETOS
  test("Deve rejeitar livro sem título", async () => {
    const token = jwt.sign({ id: "usuario-teste" }, process.env.JWT_SECRET);

    const resposta = await request(app)
      .post("/livros")
      .set("Authorization", `Bearer ${token}`)
      .send({
        autor: "Autor Teste",
      });

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body.erro).toBe("Título e autor são obrigatórios");

    expect(Livro.create).not.toHaveBeenCalled();
  });
});

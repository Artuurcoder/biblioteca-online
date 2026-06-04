require("dotenv").config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Biblioteca Online",
      version: "1.0.0",
      description: "Documentação da API da Biblioteca Online",
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./biblioteca_online/src/app.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não informado",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({
        erro: "Token inválido",
      });
    }

    req.usuario = usuario;
    next();
  });
}

// Rota inicial
/**
 * @swagger
 * /:
 *   get:
 *     summary: Verifica se a API está funcionando
 *     responses:
 *       200:
 *         description: API funcionando
 */
app.get("/", (req, res) => {
  res.send("Biblioteca Online funcionando!");
});

// Lista de livros
const livros = [
  { id: 1, titulo: "Harry Potter e a Pedra Filosofal", autor: "J.K. Rowling" },
  { id: 2, titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien" },
];

// LISTAR TODOS OS LIVROS
/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Buscar livros
 *     tags:
 *       - Livros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   autor:
 *                     type: string
 */
app.get("/livros", (req, res) => {
  res.json(livros);
});

// BUSCAR LIVRO POR ID
app.get("/livros/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const livro = livros.find((l) => l.id === id);

  if (!livro) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  res.json(livro);
});

// ADICIONAR LIVRO
/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Adiciona um novo livro
 *     tags:
 *       - Livros
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *             required:
 *               - id
 *               - titulo
 *               - autor
 *     responses:
 *       201:
 *         description: Livro cadastrado com sucesso
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido
 */
app.post("/livros", autenticarToken, (req, res) => {
  const novoLivro = req.body || {};

  if (!novoLivro.id || !novoLivro.titulo || !novoLivro.autor) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  livros.push(novoLivro);
  res.status(201).json(novoLivro);
});

// ATUALIZAR LIVRO
/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza um livro
 *     tags:
 *       - Livros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       404:
 *         description: Livro não encontrado
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido
 */
app.put("/livros/:id", autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);
  const dados = req.body;

  const livro = livros.find((l) => l.id === id);

  if (!livro) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  livro.titulo = dados.titulo;
  livro.autor = dados.autor;

  res.json(livro);
});

// DELETAR LIVRO
/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Remove um livro
 *     tags:
 *       - Livros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro removido com sucesso
 *       404:
 *         description: Livro não encontrado
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido
 */
app.delete("/livros/:id", autenticarToken, (req, res) => {
  const id = parseInt(req.params.id);

  const index = livros.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  livros.splice(index, 1);

  res.json({
    mensagem: "Livro removido com sucesso",
    lista: livros,
  });
});

// Lista de usuários
// Lista de usuários
const usuarios = [];

// CADASTRAR USUÁRIO
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *             required:
 *               - nome
 *               - email
 *               - senha
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: "Todos os campos são obrigatórios",
    });
  }

  const usuarioExiste = usuarios.find((usuario) => usuario.email === email);

  if (usuarioExiste) {
    return res.status(400).json({
      erro: "E-mail já cadastrado",
    });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha: senhaCriptografada,
  };

  usuarios.push(novoUsuario);

  res.status(201).json({
    mensagem: "Usuário cadastrado com sucesso",
  });
});

// LOGIN
/**
 * @swagger
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *             required:
 *               - email
 *               - senha
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Usuário ou senha inválidos
 */
app.post("/login", async (req, res) => {
  const { email, senha } = req.body || {};

  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    return res.status(401).json({
      erro: "Usuário não encontrado",
    });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({
      erro: "Senha inválida",
    });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.json({
    mensagem: "Login realizado com sucesso",
    token,
  });
});

// LISTAR USUÁRIOS
app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

// INICIAR SERVIDOR
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

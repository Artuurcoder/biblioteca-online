require("dotenv").config();

const conectarBanco = require("./config/database");
const Livro = require("../models/Livro");
const Usuario = require("../models/Usuario");

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

app.use(express.json());

/* ======================================================
   CONFIGURAÇÃO DO SWAGGER
====================================================== */

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API Biblioteca Online",
      version: "2.0.0",
      description:
        "API da Biblioteca Online utilizando Node.js, Express, JWT e MongoDB",
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

/* ======================================================
   MIDDLEWARE DE AUTENTICAÇÃO
====================================================== */

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não informado",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      erro: "Token não informado",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
    if (erro) {
      return res.status(403).json({
        erro: "Token inválido",
      });
    }

    req.usuario = usuario;

    next();
  });
}

/* ======================================================
   ROTA INICIAL
====================================================== */

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

/* ======================================================
   LIVROS
====================================================== */

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     tags:
 *       - Livros
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
app.get("/livros", async (req, res) => {
  try {
    const livros = await Livro.find();

    res.json(livros);
  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao buscar livros",
    });
  }
});

/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Busca um livro pelo ID
 *     tags:
 *       - Livros
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Livro não encontrado
 */
app.get("/livros/:id", async (req, res) => {
  try {
    const livro = await Livro.findById(req.params.id);

    if (!livro) {
      return res.status(404).json({
        erro: "Livro não encontrado",
      });
    }

    res.json(livro);
  } catch (erro) {
    res.status(400).json({
      erro: "ID inválido",
    });
  }
});

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Cadastra um novo livro
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
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               categoria:
 *                 type: string
 *               ano_publicacao:
 *                 type: integer
 *               quantidade_total:
 *                 type: integer
 *               quantidade_disponivel:
 *                 type: integer
 *             required:
 *               - titulo
 *               - autor
 *     responses:
 *       201:
 *         description: Livro cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
app.post("/livros", autenticarToken, async (req, res) => {
  try {
    const {
      titulo,
      autor,
      categoria,
      ano_publicacao,
      quantidade_total,
      quantidade_disponivel,
    } = req.body;

    if (!titulo || !autor) {
      return res.status(400).json({
        erro: "Título e autor são obrigatórios",
      });
    }

    const novoLivro = await Livro.create({
      titulo,
      autor,
      categoria,
      ano_publicacao,
      quantidade_total,
      quantidade_disponivel,
    });

    res.status(201).json(novoLivro);
  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao cadastrar livro",
    });
  }
});

/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza um livro
 *     tags:
 *       - Livros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               categoria:
 *                 type: string
 *               ano_publicacao:
 *                 type: integer
 *               quantidade_total:
 *                 type: integer
 *               quantidade_disponivel:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       404:
 *         description: Livro não encontrado
 */
app.put("/livros/:id", autenticarToken, async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!livro) {
      return res.status(404).json({
        erro: "Livro não encontrado",
      });
    }

    res.json(livro);
  } catch (erro) {
    res.status(400).json({
      erro: "Erro ao atualizar livro",
    });
  }
});

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Remove um livro
 *     tags:
 *       - Livros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro removido com sucesso
 *       404:
 *         description: Livro não encontrado
 */
app.delete("/livros/:id", autenticarToken, async (req, res) => {
  try {
    const livro = await Livro.findByIdAndDelete(req.params.id);

    if (!livro) {
      return res.status(404).json({
        erro: "Livro não encontrado",
      });
    }

    res.json({
      mensagem: "Livro removido com sucesso",
    });
  } catch (erro) {
    res.status(400).json({
      erro: "Erro ao remover livro",
    });
  }
});

/* ======================================================
   USUÁRIOS
====================================================== */

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
  try {
    const { nome, email, senha } = req.body || {};

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: "Todos os campos são obrigatórios",
      });
    }

    const usuarioExiste = await Usuario.findOne({
      email,
    });

    if (usuarioExiste) {
      return res.status(400).json({
        erro: "E-mail já cadastrado",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
    });

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
    });
  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao cadastrar usuário",
    });
  }
});

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
  try {
    const { email, senha } = req.body || {};

    const usuario = await Usuario.findOne({
      email,
    });

    if (!usuario) {
      return res.status(401).json({
        erro: "Usuário não encontrado",
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Senha inválida",
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      mensagem: "Login realizado com sucesso",
      token,
    });
  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao realizar login",
    });
  }
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista os usuários cadastrados
 *     tags:
 *       - Usuários
 *     responses:
 *       200:
 *         description: Usuários retornados com sucesso
 */
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha");

    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao buscar usuários",
    });
  }
});

/* ======================================================
   INICIAR APLICAÇÃO
====================================================== */

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  await conectarBanco();

  app.listen(PORT, () => {
    console.log(
      `Servidor rodando em http://localhost:${PORT}`
    );
  });
}

iniciarServidor();
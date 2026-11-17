# Biblioteca Online 📚

Sistema web para gerenciamento de uma biblioteca, desenvolvido como projeto acadêmico interdisciplinar do curso de Tecnologia em Sistemas para Internet.

## Integrantes

- **Artur Almeida Nunes** — Polo Apodi/RN

## 1. Sobre o projeto

A Biblioteca Online é uma aplicação web que permite o gerenciamento de livros e usuários por meio de uma interface simples e de uma API REST.

O sistema possibilita cadastrar usuários, realizar login, consultar livros, cadastrar novos exemplares, atualizar informações e excluir registros.

A aplicação utiliza autenticação JWT para proteger as operações de gerenciamento de livros.

## 2. Tecnologias utilizadas

**Back-end**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcryptjs

**Front-end**

- HTML5
- CSS3
- JavaScript

**Testes e integração contínua**

- Jest
- Supertest
- Jest Environment JSDOM
- GitHub Actions

**Hospedagem**

- Render
- MongoDB Atlas

## 3. Funcionalidades

- Cadastro de usuários.
- Login e autenticação com JWT.
- Criptografia de senhas.
- Cadastro de livros.
- Listagem de livros.
- Consulta de livro por ID.
- Atualização de informações dos livros.
- Exclusão de livros.
- Validação dos dados cadastrados.
- Proteção das operações de gerenciamento por autenticação.

## 4. Estrutura do projeto

```text
bibliotecaonline/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── biblioteca_online/
│   ├── models/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── routes/
│   │   ├── utils/
│   │   │   └── validarLivro.js
│   │   └── app.js
│   │
│   └── public/
│       ├── index.html
│       ├── app.js
│       └── style.css
│
├── tests/
│   ├── app.test.js
│   ├── frontend.test.js
│   └── validarLivro.test.js
│
├── package.json
├── package-lock.json
└── README.md
```

## 5. Instalação e configuração

Para executar o projeto localmente, é necessário possuir Node.js e uma conexão com o MongoDB.

**1. Clonar o repositório**

```bash
git clone https://github.com/Artuurcoder/biblioteca-online.git
```

**2. Entrar na pasta do projeto**

```bash
cd biblioteca-online
```

**3. Instalar as dependências**

```bash
npm install
```

**4. Configurar as variáveis de ambiente**

Criar um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta
```

As credenciais devem ser mantidas em variáveis de ambiente e não devem ser publicadas no repositório.

**5. Executar a aplicação**

```bash
npm start
```

Para executar em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

## 6. Documentação da API

A API possui documentação interativa utilizando Swagger.

**Acesso local:**

```text
http://localhost:3000/api-docs
```

### Endpoints disponíveis

| Método | Endpoint      | Descrição           | Autenticação |
| ------ | ------------- | ------------------- | ------------ |
| POST   | `/register`   | Cadastrar usuário   | Não          |
| POST   | `/login`      | Realizar login      | Não          |
| GET    | `/livros`     | Listar livros       | Não          |
| GET    | `/livros/:id` | Buscar livro por ID | Não          |
| POST   | `/livros`     | Cadastrar livro     | Sim          |
| PUT    | `/livros/:id` | Atualizar livro     | Sim          |
| DELETE | `/livros/:id` | Excluir livro       | Sim          |
| GET    | `/usuarios`   | Listar usuários     | Sim          |

Nas rotas protegidas, é necessário enviar o token JWT no cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

## 7. Testes automatizados

O projeto utiliza Jest e Supertest para executar testes automatizados.

Os testes estão organizados em três arquivos:

- `app.test.js`: testes das operações e rotas da API.
- `frontend.test.js`: testes das funcionalidades do frontend.
- `validarLivro.test.js`: testes das regras de validação dos livros.

Para executar os testes:

```bash
npm test
```

**Resultado obtido durante o desenvolvimento:**

- 3 suítes de testes aprovadas.
- 16 testes aprovados.
- Nenhum teste reprovado.

## 8. Integração contínua (CI)

O projeto utiliza GitHub Actions para automatizar a execução dos testes.

O workflow está localizado em:

```text
.github/workflows/ci.yml
```

O pipeline executa as seguintes etapas:

1. Baixa o código do repositório.
2. Configura o ambiente Node.js 22.
3. Instala as dependências com `npm ci`.
4. Executa os testes automatizados com `npm test`.

O workflow é acionado em eventos de push e pull request nas branches `main` e `atividade-nuvem`.

## 9. Publicação da aplicação

A aplicação está hospedada na plataforma Render, utilizando o MongoDB Atlas como banco de dados.

**Aplicação publicada:**

[https://biblioteca-online-paas.onrender.com/](https://biblioteca-online-paas.onrender.com/)

**Documentação Swagger:**

[https://biblioteca-online-paas.onrender.com/api-docs](https://biblioteca-online-paas.onrender.com/api-docs)

## 10. Repositório

O código-fonte, os testes automatizados e as configurações do projeto estão disponíveis publicamente no GitHub:

[https://github.com/Artuurcoder/biblioteca-online](https://github.com/Artuurcoder/biblioteca-online)

---

**Projeto acadêmico — Tecnologia em Sistemas para Internet**

Artur Almeida Nunes e Aleff Felipe de Lima Pereira
Polo Apodi/RN


# ALUNO: Artur Almeida Nunes (Polo:Apodi - RN)
# ALUNO: Aleff Felipe de Lima Pereira (Polo:Apodi - RN)


# Biblioteca Online 📚

Projeto interdisciplinar das disciplinas do terceiro semestre do curso de tecnologia em sistemas para internet, que é uma implementação de um Sistema de Biblioteca Online.


## Stack utilizada

**Back-end:** Node, Express


## Estrutura do projeto


**biblioteca_online**
- **src/**  
  - **routes/**
    - livros.js
    - usuarios.js
  - **apps.js**

**node_modules**

**package-lock.json**

**package.json**


**`/routes`** → Define as rotas da API.

**`/apps.js`** → Responsável por iniciar o servidor.

## Sobre o projeto

### Configuração inicial

Após as pastas e arquivos base serem criados, no terminal é excutado o comando ``npm init -y`` que inicia o projeto e cria os arquivos de configuração `package.json` e `package-lock.json`. 

### Depedências utilizadas

- **Express.js:** O express é um framework para Node que auxilia na construção do back-end através de rotas, requisições HTTP e também para iniciar o servidor. Usa-se o seguinte comando para instalá-lo.

```
npm install express
```

- **Nodemon:** É usado para que o servidor reinicie automaticamente após alguma alteração no código ser salva. Para instalar o mesmo basta executar o seguinte comando no terminal:

```
npm install nodemon -D
```

Para executar escreva o seguinte script dentro do `package.json` 

```
"scripts": {
    "dev": "nodemon ./src/apps.js"
  }
```

E para ser executado usa o seguinte comando no terminal:

```
npm run dev
```

## Documentação da API

### Retorna todos os livros


```http
  GET /livros
```
![resposta postman](https://i.imgur.com/AWoJYDF.png)

### Retorna um livro específico

```
  GET /livros/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | O ID do item que você quer |

![resposta postman](https://i.imgur.com/CGs09S1.png)

Caso não exita um livro associado ao id o aplicativo mostrará a seguinte mensagem com o status HTTP 404.

```
{"erro": "Livro não encontrado"}
```

![resposta postman](https://i.imgur.com/uloLDfC.png)

### Adiciona um livro

```
  POST /livro
```

![resposta postman](https://i.imgur.com/yzDuHfg.png)

Resultado no web

![resposta postman](https://i.imgur.com/TCay3vG.png)

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `body`      | `objeto` | Objeto contendo as informações do livro a ser adicionado |

O objeto a ser inserido no body deverá seguir o formato a seguir
```
{
  "id": Number,
  "titulo": "String",
  "autor": "String",
}
```


### Atualiza as informações de um livro

```
  PUT /livro/:id
```

PUT/livros/2

![resposta postman](https://i.imgur.com/sW1fxv5.png)

PUT/livros/3
![resposta postman](https://i.imgur.com/5Pkp5D4.png)

Resultado no web

![resposta postman](https://i.imgur.com/hEv2rPa.png)

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `body`      | `objeto` | Objeto contendo as informações do livro a ser adicionado |

O objeto a ser inserido no body deverá seguir o formato a seguir
```
{
  "titulo": "String",
  "autor": "String",
}
```

Caso não exita um livro associado ao id o aplicativo mostrará a seguinte mensagem com o status HTTP 404.

```
{"erro": "livro não encontrado"}
```
![resposta postman](https://i.imgur.com/sfDVr7m.png)

### Apaga um livro

```
  DELETE /livros/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | O ID do item que você quer apagar|

Em caso de sucesso a seguinte mensagem será mostrada junto do status 200.

```
{"mensagem": "Livro removido com sucesso!"}
```
DELETE/livros/1
![resposta postman](https://i.imgur.com/Lo6Qfkf.png)

DELETE/livros/3
![resposta postman](https://i.imgur.com/qGRgzQ7.png)

Resultado no web

![resposta postman](https://i.imgur.com/RbTwrra.png)

Caso não exista um livro associado ao id o aplicativo mostrará a seguinte mensagem com o status HTTP 404.

```
{"erro": "Livro não encontrado"}
```
![resposta postman](https://i.imgur.com/CIRRyG0.png)




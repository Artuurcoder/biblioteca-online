/*
  Validação dos dados de um livro.
  Retorna uma mensagem de erro quando
  os campos obrigatórios não são informados.
*/

function validarLivro(dados) {
  if (!dados || !dados.titulo || !dados.autor) {
    return {
      valido: false,
      erro: "Título e autor são obrigatórios",
    };
  }

  return {
    valido: true,
    erro: null,
  };
}

module.exports = validarLivro;

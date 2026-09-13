const mongoose = require("mongoose");

const livroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    autor: {
      type: String,
      required: true,
    },
    categoria: {
      type: String,
      default: "",
    },
    ano_publicacao: {
      type: Number,
    },
    quantidade_total: {
      type: Number,
      default: 1,
    },
    quantidade_disponivel: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Livro", livroSchema);

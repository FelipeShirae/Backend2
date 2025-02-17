const mongoose = require("mongoose");

const IngressoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidade: { type: Number, required: true, min: 0 }
});

const Ingresso = mongoose.model("Ingresso", IngressoSchema);
module.exports = Ingresso;

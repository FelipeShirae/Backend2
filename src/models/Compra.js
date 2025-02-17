const mongoose = require("mongoose");

const CompraSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  ingressos: [
    {
      ingresso: { type: mongoose.Schema.Types.ObjectId, ref: "Ingresso", required: true },
      quantidade: { type: Number, required: true, min: 1 }
    }
  ],
  dataCompra: { type: Date, default: Date.now }
});

const Compra = mongoose.model("Compra", CompraSchema);
module.exports = Compra;

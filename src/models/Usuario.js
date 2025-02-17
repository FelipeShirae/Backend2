const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  papel: { type: String, enum: ["usuario", "admin"], default: "usuario" }
});

// Antes de salvar, faz o hash da senha
UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);
module.exports = Usuario;

const express = require("express");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Rota de Cadastro de Usuário
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, papel } = req.body;

    // Verifica se o e-mail já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ erro: "E-mail já cadastrado" });

    const usuario = new Usuario({ nome, email, senha, papel });
    await usuario.save();

    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
});

// Rota de Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o usuário existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ erro: "Usuário não encontrado" });

    // Compara a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: "Senha incorreta" });

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario._id, papel: usuario.papel },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Redireciona para a página de sucesso ou dashboard após login bem-sucedido
    res.redirect("/dashboard");  // Aqui, você pode alterar para qualquer rota que queira
  } catch (err) {
    res.status(500).json({ erro: "Erro ao realizar login" });
  }
});

  // Rota para exibir a página de login
router.get("/login", (req, res) => {
    res.render("pages/login");
  });

module.exports = router;

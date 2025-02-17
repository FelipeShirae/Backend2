const express = require("express");
const Ingresso = require("../models/Ingresso");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Criar ingresso (Apenas Admin)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.usuario.papel !== "admin") return res.status(403).json({ erro: "Apenas administradores podem criar ingressos." });

    const { nome, preco, quantidade } = req.body;
    const ingresso = new Ingresso({ nome, preco, quantidade });
    await ingresso.save();

    res.status(201).json({ mensagem: "Ingresso criado com sucesso!", ingresso });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar ingresso" });
  }
});

// Listar todos os ingressos
router.get("/", async (req, res) => {
  try {
    const ingressos = await Ingresso.find();
    res.json(ingressos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar ingressos" });
  }
});

// Atualizar ingresso (Apenas Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.usuario.papel !== "admin") return res.status(403).json({ erro: "Apenas administradores podem editar ingressos." });

    const { nome, preco, quantidade } = req.body;
    const ingresso = await Ingresso.findByIdAndUpdate(req.params.id, { nome, preco, quantidade }, { new: true });

    if (!ingresso) return res.status(404).json({ erro: "Ingresso não encontrado." });

    res.json({ mensagem: "Ingresso atualizado!", ingresso });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar ingresso" });
  }
});

// Deletar ingresso (Apenas Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.usuario.papel !== "admin") return res.status(403).json({ erro: "Apenas administradores podem excluir ingressos." });

    const ingresso = await Ingresso.findByIdAndDelete(req.params.id);
    if (!ingresso) return res.status(404).json({ erro: "Ingresso não encontrado." });

    res.json({ mensagem: "Ingresso deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar ingresso" });
  }
});

module.exports = router;

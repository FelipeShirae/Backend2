const express = require("express");
const Compra = require("../models/Compra");
const Ingresso = require("../models/Ingresso");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Realizar uma compra
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { ingressos } = req.body;

    if (!ingressos || ingressos.length === 0) {
      return res.status(400).json({ erro: "Nenhum ingresso selecionado." });
    }

    let total = 0;
    const compraIngressos = [];

    for (const item of ingressos) {
      const ingresso = await Ingresso.findById(item.ingresso);

      if (!ingresso || item.quantidade > ingresso.quantidade) {
        return res.status(400).json({ erro: `Estoque insuficiente para o ingresso ${ingresso.nome}.` });
      }

      // Atualizar estoque
      ingresso.quantidade -= item.quantidade;
      await ingresso.save();

      total += ingresso.preco * item.quantidade;
      compraIngressos.push({ ingresso: item.ingresso, quantidade: item.quantidade });
    }

    // Criar compra
    const novaCompra = new Compra({
      usuario: req.usuario.id,
      ingressos: compraIngressos
    });

    await novaCompra.save();
    res.status(201).json({ mensagem: "Compra realizada com sucesso!", compra: novaCompra, total });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao processar a compra" });
  }
});

// Visualizar detalhes de uma compra (renderizando página)
router.get("/detalhe/:id", authMiddleware, async (req, res) => {
    try {
      const compra = await Compra.findById(req.params.id).populate("ingressos.ingresso");
  
      if (!compra) {
        return res.status(404).json({ erro: "Compra não encontrada" });
      }
  
      // Verifica se a compra pertence ao usuário logado
      if (compra.usuario.toString() !== req.usuario.id) {
        return res.status(403).json({ erro: "Acesso negado." });
      }
  
      // Renderiza a página de detalhes, enviando a compra como contexto
      res.render("pages/compra-detalhe", { compra });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao buscar compra" });
    }
  });
  

// Histórico de compras do usuário
router.get("/", authMiddleware, async (req, res) => {
  try {
    const compras = await Compra.find({ usuario: req.usuario.id }).populate("ingressos.ingresso");
    res.json(compras);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar histórico de compras" });
  }
});

// Visualizar uma compra específica
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id).populate("ingressos.ingresso");

    if (!compra || compra.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    res.json(compra);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar compra" });
  }
});


// Rota para exibir o histórico de compras do usuário autenticado
router.get("/historico", authMiddleware, async (req, res) => {
    try {
      const compras = await Compra.find({ usuario: req.usuario.id }).populate("ingresso");
  
      res.render("pages/historico", { compras });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao buscar histórico de compras" });
    }
  });

  
  

module.exports = router;

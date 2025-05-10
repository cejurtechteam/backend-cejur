const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// GET all articles

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("articles").get();
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar artigos." });
  }
});

// GET article by ID

router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("articles").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar artigo" });
  }
});

// POST add article

router.post("/", async (req, res) => {
  try {
    const newArticle = {
      ...req.body,
      date: new Date(),
    };

    const docRef = await db.collection("articles").add(newArticle);

    res.status(201).json({ id: docRef.id, ...newArticle });
  } catch (err) {
    console.error("Erro ao adicionar artigo:", err);
    res.status(500).json({ error: "Erro ao adicionar artigo" });
  }
});

// PUT edit article

router.put("/:id", async (req, res) => {
  try {
    await db.collection("articles").doc(req.params.id).update(req.body);
    res.json({ message: "Artigo atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar artigo:", err);
    res.status(500).json({ error: "Erro ao atualizar artigo." });
  }
});

// DELETE delete article

router.delete("/:id", async (req, res) => {
  try {
    await db.collection("articles").doc(req.params.id).delete();
    res.json({ message: "Artigo excluído com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir artigo:", err);
    res.status(500).json({ error: "Erro ao excluir artigo." });
  }
});

module.exports = router;

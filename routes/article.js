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
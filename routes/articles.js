const express = require("express");
const router = express.Router();
const db = require("../config/firebase");
const axios = require("axios");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fs = require("fs");
const FormData = require("form-data");

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

// Upload image to imgur
const uploadToImgur = async (buffer) => {
  const CLIENT_ID = process.env.IMGUR_CLIENT_ID;
  const url = "https://api.imgur.com/3/image";

  try {
    const response = await axios.post(
      url,
      { image: buffer.toString("base64") },
      {
        headers: {
          Authorization: `Client-ID ${CLIENT_ID}`,
        },
      }
    );
    return response.data.data.link;
  } catch (err) {
    console.error(
      "Erro ao fazer upload para o Imgur:",
      err.response?.data || err.message
    );
    throw new Error("Erro ao fazer upload para o Imgur");
  }
};

// POST add article
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file ? await uploadToImgur(req.file.buffer) : null;

    const newArticle = {
      ...req.body,
      content: JSON.parse(req.body.content), 
      image: imageUrl,
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

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let updatedData = {
      title: req.body.title,
      category: req.body.category,
      author: req.body.author,
      description: req.body.description,
      content: JSON.parse(req.body.content),
      date: new Date(),
    };

    if (req.file) {
      const imageUrl = await uploadToImgur(req.file.buffer);
      updatedData.image = imageUrl;
    }

    await db.collection("articles").doc(req.params.id).update(updatedData);

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

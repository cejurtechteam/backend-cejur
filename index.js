const express = require("express");
const cors = require("cors");
const articlesRoutes = require("./routes/articles");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/articles", articlesRoutes);

app.listen(PORT, () => {
    console.log(`Servido rodando na porta ${PORT}`)
})
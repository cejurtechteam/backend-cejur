const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Captura o token enviado no header

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso não autorizado. Token faltando." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido." });
    }

    req.user = user;
    next();
  });
};

module.exports = verifyToken;

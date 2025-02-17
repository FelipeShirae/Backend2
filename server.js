const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ingressoRoutes = require("./src/routes/ingressoRoutes");
const compraRoutes = require("./src/routes/compraRoutes");
const exphbs = require("express-handlebars");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes");  

dotenv.config();

const app = express();
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1);  // Adicionando para finalizar a aplicação em caso de erro
  });

// Configurar Handlebars como motor de templates
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

// Registrar a rota de login diretamente na raiz "/"
app.get("/login", (req, res) => {
    res.render("pages/login");
});

// Rotas de API
app.use("/api/auth", authRoutes);
app.use("/api/ingressos", ingressoRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/auth", authRoutes);

// Rota para exibir o histórico de compras
app.get("/historico", (req, res) => {
  res.render("pages/historico");
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Definir helpers do Handlebars
const hbs = exphbs.create({
  helpers: {
    multiplicar: (a, b) => a * b,
    formatarData: (data) => {
      return new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
  },
  defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

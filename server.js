require("dotenv").config();
const express = require("express");
const path = require("path");
const chatController = require("./controllers/chatController")
const app = express();
const port = 3000;
// Configuração do EJS para as views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Permite ao servidor definir o corpo da requisição em formato JSON (API/fetch)
app.use(express.json());

//Permite ao servidor definir dados enviados por formulários HTML
app.use(express.urlencoded({ extended: true }));

// Define a pasta 'public' como a fonte de arquivos estáticos (CSS, imagens, JS)
app.use(express.static(path.join(__dirname, "public")));

// Rota principal: renderiza a view 'index' e injeta o histórico carregado  
app.get("/", async (req, res) => {
  const history  = await chatController.loadHistory();
  res.render("index", {history});
});
// Rota de envio: processa a requisição POST e encaminha a mensagem à lógica de IA
app.post("/chat", chatController.sendMessage);
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

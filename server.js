// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
// Módulos internos para controle de fluxo e serviços
const chatController = require("./controllers/chatController");
const { loadManualOnce } = require("./services/contextService");

// Configuração principal
const app = express();
const port = 3000;

// --- Configuração de Views (EJS) ---
app.set("view engine", "ejs");
// Define o diretório onde o EJS deve buscar os arquivos de view
app.set("views", path.join(__dirname, "views"));

// --- Middlewares Globais ---
// Middleware para processar corpo de requisições JSON (usado para a rota /chat com fetch)
app.use(express.json());
// Middleware para processar corpo de requisições URL-encoded (dados de formulários HTML)
app.use(express.urlencoded({ extended: true }));

// Define a pasta 'public' como a fonte de arquivos estáticos (CSS, imagens, JS do cliente)
app.use(express.static(path.join(__dirname, "public")));

// --- Roteamento da Aplicação ---

/**
 * Rota GET / (Principal)
 * Renderiza a página do chat, injetando o histórico de mensagens.
 * O controlador é responsável por orquestrar o carregamento do histórico.
 */
app.get("/", async (req, res) => {
  // Chamada ao Controller para carregar o histórico persistido
  const history = await chatController.loadHistory();
  // Renderiza a view 'index.ejs', passando o histórico como dado local
  res.render("index", { history });
});

/**
 * Rota POST /chat
 * Endpoint principal para o envio de mensagens do usuário.
 * O controlador manipula a requisição, chama a IA e persiste o novo histórico.
 */
app.post("/chat", chatController.sendMessage);

// --- Inicialização do Servidor ---

// Executa o pré-carregamento do manual e só então inicia o servidor (Otimização)
(async () => {
  // Pré-carrega o manual (contexto RAG) em memória para acesso rápido.
  await loadManualOnce();
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
})();

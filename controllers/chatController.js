const { Groq } = require("groq-sdk");
const fs = require("fs/promises");
const path = require("path");

// Inicialização da Groq e caminho do arquivo de histórico
const groq = new Groq();
const HISTORY_FILE = path.join(__dirname, "..", "data", "history.json");

// Função para carregar o histórico
const loadHistory = async () => {
  try {
    const data = await fs.readFile(HISTORY_FILE, "utf-8")
    return JSON.parse(data);
  } catch(error) {
    if(error.code == "ENOENT") {
      return [];
    }
    console.error("Erro ao carregar histórico", error.message);
    return [];
  }
};

// Função para salvar o histórico
const saveHistory = async (history) => {
  try {
    // 1. Garante que o diretório 'data' exista antes de escrever
    await fs.mkdir(path.dirname(HISTORY_FILE), {recursive: true});
    
    // 2. Converte o array para JSON formatado (null, 2) e salva no arquivo
    await fs.writeFile(HISTORY_FILE,JSON.stringify(history,null,2));
  } catch(error) {
    console.error("Erro ao salvar histórico", error)
  }
};

// Controlador principal para enviar mensagem e chamar a IA
// O corpo desta função SERÁ PREENCHIDO POR GABRIEL M. REIS (Tarefa 6º - Lógica IA)
const sendMessage = async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Mensagem vazia." });
  }

  // Placeholder temporário antes do PR de Gabriel M. Reis
  res.status(501).json({ error: "Funcionalidade de IA em desenvolvimento." });
};

// Exporta as funções que serão usadas pelo server.js
module.exports = {
  loadHistory,
  sendMessage,
  saveHistory,
};

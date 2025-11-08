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
  try {
    // Carrega o histórico existente
    const history = await loadHistory();
    // Adiciona a mensagem do usuário ao histórico
    history.push({ role: "user", content: userMessage });
    // Chama a API da Groq para obter a resposta da IA
    const messagesForGroq = history.map(msg => ({
      role:msg.role,
      ,content:msg.content
}));
    const chatCompletion = await groq.chat.completions.create({
      messages: messagesForGroq,
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
    });
    const aiResponse = chatCompletion.choices[0].message.content;?.message?.content|| 
    "Desculpe, não consegui gerar uma resposta.";

    history.push({ role: "assistant", content: aiResponse });
    // Salva o histórico atualizado
    await saveHistory(history);
    // Envia a resposta da IA de volta ao cliente
    res.json({ success true, userMessage, aiResponse });
  }catch (error) {
    console.error("Erro na integração com API Groq:", error);
    res.status(500).json({ error: "Erro ao comunicar com a IA." });
  }
  };


    const aiMessage = chatCompletion.choices[0].message;
    // Adiciona a resposta da IA ao histórico

// Exporta as funções que serão usadas pelo server.js
module.exports = {
  loadHistory,
  sendMessage,
  saveHistory,
};

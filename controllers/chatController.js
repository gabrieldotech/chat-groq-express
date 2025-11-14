// Arquivo: controllers/chatController.js
// Camada de Controle: Orquestra a lógica de negócio (Services) e a comunicação com APIs externas.

const { Groq } = require("groq-sdk");
// Serviços internos para Contexto (RAG) e Persistência (Histórico)
const { getFullContext } = require("../services/contextService");
const { loadHistory, saveHistory } = require("../services/historyService");

// Inicialização do cliente da Groq
const groq = new Groq();

/**
 * Função exportada para a rota GET "/" (server.js).
 * Abstrai o acesso ao serviço de histórico para a camada de roteamento.
 * @returns {Promise<Array<Object>>} O histórico de mensagens carregado.
 */
const loadHistoryForRoute = async () => {
  return await loadHistory();
};

/**
 * Processa a requisição POST para envio de mensagem.
 * 1. Valida a entrada.
 * 2. Orquestra o carregamento de contexto e histórico.
 * 3. Monta o System Prompt com RAG.
 * 4. Chama a API da Groq.
 * 5. Persiste as novas mensagens no histórico.
 * 6. Retorna a resposta ao cliente.
 */
const sendMessage = async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Mensagem vazia." });

  try {
    // 1. Carregar contexto e histórico usando os Services
    const history = await loadHistoryForRoute();
    const fullContext = await getFullContext(); // Conteúdo do MANUAL.MD

    // 2. Montar a instrução do sistema (System Prompt) com o contexto RAG
    const systemInstruction = `Você é um atendente especialista da Braz Cubas. Resuma respostas de forma breve e objetiva. Nunca use markdown, símbolos especiais, listas com marcadores ou formatação, apenas retorne texto puro.`;
    // Injeção do contexto RAG: O LLM priorizará esta informação
    const systemPromptWithContext = `${systemInstruction}\n\n**MANUAL COMPLETO PARA REFERÊNCIA:**\n${fullContext}`;

    // 3. Preparar as mensagens para a API (seguindo o padrão Groq/OpenAI)
    const messagesForGroq = [
      { role: "system", content: systemPromptWithContext },
      ...history.slice(-10), // Limita o histórico de conversa a N mensagens (Otimização de Token)
      { role: "user", content: userMessage },
    ];

    // 4. Chamar a API da Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: messagesForGroq,
      model: "openai/gpt-oss-120b", // Modelo mais adequado para tarefas complexas com RAG
      temperature: 0.1, // Temperatura baixa para respostas objetivas e factuais (atendimento)
    });

    const aiResponse =
      chatCompletion.choices[0]?.message?.content || "Erro ao gerar resposta.";

    // 5. Salvar histórico e responder ao cliente (Persistência assíncrona)
    history.push({ role: "user", content: userMessage });
    history.push({ role: "assistant", content: aiResponse });

    await saveHistory(history);
    res.json({ success: true, userMessage, aiResponse });
  } catch (error) {
    console.error("Erro na IA/Controlador:", error);
    res.status(500).json({ error: "Erro ao comunicar com a IA." });
  }
};

// Exporta as funções necessárias para o servidor
module.exports = { loadHistory: loadHistoryForRoute, sendMessage };

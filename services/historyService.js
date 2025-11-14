// Arquivo: services/historyService.js
// Camada de Serviço: Encapsula a lógica de I/O (Input/Output) e persistência de dados.

const fs = require("fs/promises");
const path = require("path");

// Define o caminho absoluto para o arquivo de histórico
const HISTORY_FILE = path.join(__dirname, "..", "data", "history.json");

/**
 * Carrega o histórico de mensagens do arquivo JSON (Persistência local).
 * Trata de forma elegante o erro de arquivo não encontrado (ENOENT).
 * @returns {Promise<Array<Object>>} O histórico de mensagens (Array de objetos) ou um array vazio.
 */
const loadHistory = async () => {
  try {
    const data = await fs.readFile(HISTORY_FILE, "utf-8");
    // Parseia o JSON lido do arquivo
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna um array vazio (primeira execução)
    if (error.code === "ENOENT") return [];
    console.error("Erro ao carregar histórico:", error.message);
    return [];
  }
};

/**
 * Salva o histórico de mensagens no arquivo JSON.
 * Garante que o diretório 'data' exista antes de escrever o arquivo (mkdir {recursive: true}).
 * @param {Array<Object>} history - O array de histórico a ser salvo.
 * @returns {Promise<void>}
 */
const saveHistory = async (history) => {
  try {
    // Cria o diretório se não existir, de forma recursiva (garante que 'data' exista)
    await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });
    // Escreve o array formatado com indentação de 2 espaços para legibilidade
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error("Erro ao salvar histórico:", error);
  }
};

// Exporta as funções de I/O para serem usadas pelo Controller
module.exports = { loadHistory, saveHistory };

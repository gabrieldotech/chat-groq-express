// Arquivo: services/contextService.js
// Camada de Serviço: Encapsula a lógica de carregamento e cache do contexto RAG.

const fs = require("fs/promises");
const path = require("path");

// Define o caminho absoluto para o arquivo de manual (fonte de contexto RAG)
const MANUAL_FILE = path.join(__dirname, "..", "data", "MANUAL.MD");
// Variável de cache para armazenar o conteúdo do manual em memória
let manualCache = null;

/**
 * Carrega o manual (contexto RAG) em memória apenas uma vez (Cache/Singleton).
 * Esta função é chamada na inicialização do servidor (Otimização).
 * @returns {Promise<string>} O conteúdo do manual ou uma mensagem de erro.
 */
const loadManualOnce = async () => {
  // Retorna a versão em cache imediatamente se já estiver carregada
  if (manualCache) return manualCache;
  try {
    const data = await fs.readFile(MANUAL_FILE, "utf-8");
    manualCache = data;
    console.info("Manual carregado em memória!");
    return manualCache;
  } catch (error) {
    console.error("Erro ao carregar manual:", error.message);
    manualCache = "Erro: não foi possível carregar o manual.";
    return manualCache;
  }
};

/**
 * Obtém o contexto completo (manual).
 * Força o carregamento se ainda não estiver em cache (Fallback).
 * @returns {Promise<string>} O conteúdo do manual (cacheado ou recém-carregado).
 */
const getFullContext = async () => {
  // Retorna o cache, ou força a chamada de carregamento se for nulo
  return manualCache || (await loadManualOnce());
};

// Exporta as funções para serem usadas pelo Controller e pelo Server (loadManualOnce)
module.exports = { loadManualOnce, getFullContext };

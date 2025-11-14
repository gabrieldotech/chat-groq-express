// Arquivo: public/js/chatClient.js
// Camada de Apresentação (Frontend): Lida com a interação do usuário e a manipulação do DOM.

/**
 * Adiciona uma nova mensagem ao contêiner de mensagens.
 * @param {string} role - O papel da mensagem ('user' ou 'assistant').
 * @param {string} text - O texto da mensagem a ser exibida.
 */
function appendMessage(role, text) {
  const messagesContainer = document.getElementById("messages");

  const msgDiv = document.createElement("div");
  // Adiciona as classes 'message' e a classe específica do papel ('user' ou 'assistant') para CSS
  msgDiv.classList.add("message", role);

  // Cria o elemento <strong> para o rótulo do emissor
  const strong = document.createElement("strong");
  strong.textContent = role === "user" ? "Você: " : "BrazCubas IA: ";

  // Cria o elemento <span> para o conteúdo da mensagem (textContent garante que o conteúdo é tratado como texto puro, seguro contra XSS)
  const span = document.createElement("span");
  span.textContent = text;

  // Monta a estrutura da mensagem no DOM
  msgDiv.appendChild(strong);
  msgDiv.appendChild(span);

  // Adiciona o novo elemento ao contêiner
  messagesContainer.appendChild(msgDiv);

  // Rola o contêiner para a última mensagem, mantendo o foco no final da conversa
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Listener para o evento de submissão do formulário de chat
document
  .getElementById("chat-form")
  .addEventListener("submit", async function (event) {
    // Previne o comportamento padrão de recarregar a página
    event.preventDefault();
    const input = document.getElementById("message-input");
    const message = input.value.trim();
    if (!message) return; // Ignora o envio se a mensagem estiver vazia

    input.value = ""; // Limpa o campo de entrada

    // 1. Exibe a mensagem do usuário imediatamente para feedback visual
    appendMessage("user", message);

    try {
      // 2. Envia a mensagem para a rota /chat do servidor via POST (JSON)
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      const data = await response.json();

      // 3. Verifica o status da resposta e exibe o resultado
      if (response.ok && data.success) {
        // Exibe a resposta da IA
        appendMessage("assistant", data.aiResponse);
      } else {
        // Trata erros de validação (400) ou erros internos (500)
        alert(
          "Erro ao processar a mensagem: " +
            (data.error || "Erro desconhecido.")
        );
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro de conexão com o servidor.");
    }
  });

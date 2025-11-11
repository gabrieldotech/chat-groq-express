// Arquivo: public/js/chatClient.js

function appendMessage(role, text) {
  const messagesContainer = document.getElementById("messages");

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", role);
  msgDiv.innerHTML = `<strong>${
    role === "user" ? "Você:" : "IA Groq:"
  }</strong> <span>${text}</span>`;

  messagesContainer.appendChild(msgDiv);

  //Rola para o final da conversa
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
document
  .getElementById("chat-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const input = document.getElementById("message-input");
    const message = input.value.trim();
    if (!message) return;

    input.value = "";

    //1. Exibe a mensagem do usuário imediatamente
    appendMessage("user", message);

    try {
      //2.Enviar a mensagem para a rota /chat (POST)
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      const data = await response.json();

      //3. Verifica o status e exibe a resposta da IA ou um erro
      if (response.ok && data.success) {
        appendMessage("assistant", data.aiResponse);
      } else {
        alert(
          "Erro ao processar a mensagem:" + (data.error || "Erro desconhecido.")
        );
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro de conexão com o servidor.");
    }
  });

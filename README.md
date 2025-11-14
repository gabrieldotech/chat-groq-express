

# BrazCubas IA - Chatbot com RAG e Arquitetura de Camadas

Este projeto implementa um chatbot de atendimento automatizado utilizando a API da Groq, focado em alta velocidade de resposta e precisão contextual através da técnica **Retrieval-Augmented Generation (RAG)**.

O objetivo principal foi criar uma solução robusta, escalável e com alta legibilidade de código, aplicando as melhores práticas de **Arquitetura de Software em Camadas (Controller/Service)**.

-----

## Destaques Técnicos

| Feature | Descrição Técnica | Implementação |
| :--- | :--- | :--- |
| **RAG (Contexto)** | Injeta o conteúdo do `MANUAL.MD` diretamente no *System Prompt* do LLM, garantindo respostas factuais e específicas da Braz Cubas. | `contextService.js` |
| **Arquitetura** | Separação estrita de responsabilidades entre Controladores e Serviços. | Padrão Controller/Service |
| **Cache em Memória** | O manual de contexto é lido apenas uma vez na inicialização do servidor (cache), otimizando o desempenho do RAG. | `loadManualOnce()` |
| **Persistência** | O histórico de conversas é salvo localmente em `data/history.json`. | `historyService.js` |
| **Qualidade de Código** | Uso de **JSDoc** para documentação de funções e clareza de fluxo. | Comentários e Tipagem |

-----

## Como Rodar o Projeto

Siga estes passos para configurar e executar a aplicação em seu ambiente local.

### Pré-requisitos

  * **Node.js** (Versão LTS recomendada).
  * **npm** (Gerenciador de Pacotes do Node).
  * Uma chave de API da **Groq** (para o Large Language Model).

### 1\. Configuração Inicial

1.  **Clone o repositório:**

    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd chat-groq-express
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

### 2\. Configuração de Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto (o mesmo nível do `server.js`) e adicione sua chave de API:

```dotenv
# .env file
# Adicione sua chave de API Groq aqui
GROQ_API_KEY="SUA_CHAVE_AQUI"
```

### 3\. Contexto RAG (Manual de Conhecimento)

O contexto de conhecimento para o RAG é fornecido pelo arquivo **`data/MANUAL.MD`**, que já está incluído no projeto.

* O arquivo **`data/MANUAL.MD`** é a fonte primária de respostas do chatbot.
* **Ação:** Revise o conteúdo deste arquivo para garantir que as informações de atendimento da Braz Cubas estejam completas e atualizadas, conforme necessário.

### 4\. Execução

Use o script `start` definido no `package.json` para iniciar o servidor Express:

```bash
npm start
```

O servidor será iniciado na porta 3000.

> **Acesse:** Abra seu navegador e navegue para `http://localhost:3000`

-----

## Estrutura do Projeto

A aplicação segue o padrão de **Arquitetura de Camadas** para separação de responsabilidades:

```
├── controllers/            # Lógica de Controle: Roteamento, Orquestração e System Prompt (RAG)
│   └── chatController.js
├── data/                   # Persistência de Dados e Contexto RAG
│   ├── history.json        # Histórico de Conversas (Persistência)
│   └── MANUAL.MD           # Fonte de Conhecimento RAG (Contexto)
├── public/                 # Assets Estáticos: CSS e JavaScript do Cliente (Frontend)
│   ├── css/
│   └── js/
├── services/               # Lógica de Negócio: I/O, Cache e Conexão de Dados
│   ├── contextService.js   # Cache do Manual (RAG)
│   └── historyService.js   # I/O do Histórico
├── views/                  # Templates EJS (Renderização de HTML)
│   └── index.ejs
├── .env.example
├── package.json
└── server.js               # Inicialização e Roteamento Principal
```

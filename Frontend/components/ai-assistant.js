import { sendAIMessage } from "../services/AI-service.js";

// ─────────────────────────────────────────────
// AI ASSISTANT HTML
// ─────────────────────────────────────────────

export function AIAssistant() {
    return `

    <!-- AI FLOATING BUTTON -->
    
    <div class="ai-assistant-orb" id="ai-orb">

        <i class="bi bi-cpu-fill"></i>

    </div>

    <!-- AI CHAT WINDOW -->

    <div class="ai-chat-overlay" id="ai-overlay">

        <div class="ai-chat-window">

            <!-- HEADER -->

            <div class="ai-chat-header">

                <div class="ai-header-left">

                    <div class="ai-header-icon">
                        <i class="bi bi-cpu-fill"></i>
                    </div>

                    <div class="ai-header-info">

                        <h2>JGamerz AI Core</h2>

                        <span>
                            Your Gaming Assistant
                        </span>

                    </div>

                </div>

                <button class="ai-close-btn" id="ai-close-btn">

                    <i class="bi bi-x-lg"></i>

                </button>

            </div>

            <!-- MESSAGES -->

            <div class="ai-chat-messages" id="ai-chat-messages">

                <div class="ai-message ai-message-bot">

                    <div class="ai-message-content">

                        Welcome to JGamerz AI 👋  
                        Ask me anything about games,
                        hardware, esports, builds,
                        gaming news, or recommendations.

                    </div>

                </div>

            </div>

            <!-- INPUT -->

            <div class="ai-chat-input-area">

                <input
                    type="text"
                    id="ai-input"
                    placeholder="Ask anything about gaming..."
                >

                <button id="ai-send-btn">

                    <i class="bi bi-send-fill"></i>

                </button>

            </div>

        </div>

    </div>
    `;
}

// ─────────────────────────────────────────────
// INIT AI ASSISTANT
// ─────────────────────────────────────────────

export function initAIAssistant() {
    const orb = document.getElementById("ai-orb");

    const overlay = document.getElementById("ai-overlay");

    const closeBtn = document.getElementById("ai-close-btn");

    const sendBtn = document.getElementById("ai-send-btn");

    const input = document.getElementById("ai-input");

    const messagesContainer = document.getElementById("ai-chat-messages");

    // ─────────────────────────────────────────
    // OPEN CHAT
    // ─────────────────────────────────────────

    orb.addEventListener("click", () => {
        overlay.classList.add("active");

        document.body.style.overflow = "hidden";

        input.focus();
    });

    // ─────────────────────────────────────────
    // CLOSE CHAT
    // ─────────────────────────────────────────

    function closeChat() {
        overlay.classList.remove("active");

        document.body.style.overflow = "auto";
    }

    closeBtn.addEventListener("click", closeChat);

    // close when clicking outside

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeChat();
        }
    });

    // ESC close

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeChat();
        }
    });

    // ─────────────────────────────────────────
    // APPEND MESSAGE
    // ─────────────────────────────────────────

    function appendMessage(type, text) {
        const message = document.createElement("div");

        message.className = `ai-message ai-message-${type}`;

        message.innerHTML = `
            <div class="ai-message-content">
                ${text}
            </div>
        `;

        messagesContainer.appendChild(message);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ─────────────────────────────────────────
    // TYPING INDICATOR
    // ─────────────────────────────────────────

    function showTyping() {
        const typing = document.createElement("div");

        typing.className = "ai-message ai-message-bot";

        typing.id = "ai-typing";

        typing.innerHTML = `
            <div class="ai-message-content ai-typing">

                <span></span>
                <span></span>
                <span></span>

            </div>
        `;

        messagesContainer.appendChild(typing);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById("ai-typing");

        if (typing) {
            typing.remove();
        }
    }

    // ─────────────────────────────────────────
    // SEND MESSAGE
    // ─────────────────────────────────────────

    async function handleSend() {
        const text = input.value.trim();

        if (!text) return;

        // user message

        appendMessage("user", text);

        input.value = "";

        // typing animation

        showTyping();

        // AI response

        const reply = await sendAIMessage(text);

        removeTyping();

        appendMessage("bot", reply);
    }

    // SEND BUTTON

    sendBtn.addEventListener("click", handleSend);

    // ENTER KEY

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });
}

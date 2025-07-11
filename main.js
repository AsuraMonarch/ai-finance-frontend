window.onload = () => {
  greetUser();
  renderQuickReplies();
};

function greetUser() {
  appendBotMessage("👋 Hi! I'm your AI Finance Assistant. How can I help you today?");
}

function renderQuickReplies() {
  const container = document.getElementById("quick-replies");
  const suggestions = ["How’s my budget?", "Show my spending", "Set a goal"];

  container.innerHTML = "";
  suggestions.forEach(text => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", () => handleUserInput(text));
    container.appendChild(btn);
  });
}

function handleUserInput(message) {
  appendUserMessage(message);
  showTypingIndicator();
  sendMessageToBot(message);
}

function appendUserMessage(text) {
  appendMessage(text, "user-message");
}

function appendBotMessage(text) {
  appendMessage(text, "bot-message");
}

function appendMessage(text, className) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = className;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chat-box");
  const typing = document.createElement("div");
  typing.id = "typing-indicator";
  typing.className = "typing";
  typing.textContent = "AI Assistant is typing...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

async function sendMessageToBot(message) {
  try {
    const response = await fetch('https://ai-finance-backend-secure.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    setTimeout(() => {
      hideTypingIndicator();
      appendBotMessage(data.message || data.reply || "⚠️ Sorry, I didn’t get that.");
    }, 1000);
  } catch (error) {
    hideTypingIndicator();
    appendBotMessage("⚠️ Unable to connect. Please try again later.");
    console.error("Error sending message:", error);
  }
}

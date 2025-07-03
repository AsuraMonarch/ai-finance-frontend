
window.onload = () => {
  addBotMessage("👋 Hi! I'm your AI Finance Assistant. How can I help you today?");
  addQuickReplies();
}

function addUserMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = "user-message";
  msg.innerText = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addBotMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = "bot-message";
  msg.innerText = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const chatBox = document.getElementById("chat-box");
  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerText = "AI Assistant is typing...";
  typing.id = "typing-indicator";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

async function sendMessage(message) {
  addUserMessage(message);
  showTyping();

  try {
    const res = await fetch('https://ai-finance-backend-secure.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();

    setTimeout(() => {
      hideTyping();
      addBotMessage(data.reply);
    }, 1000);
  } catch (error) {
    hideTyping();
    addBotMessage("⚠️ Oops, couldn't connect to the server.");
  }
}

function addQuickReplies() {
  const container = document.getElementById("quick-replies");
  const suggestions = ["How’s my budget?", "Show my spending", "Set a goal"];
  container.innerHTML = "";
  suggestions.forEach(text => {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.onclick = () => sendMessage(text);
    container.appendChild(btn);
  });
}

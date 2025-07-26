window.onload = () => {
  greetUser();
  renderQuickReplies();
  checkAdminAccessOnLoad();
};

// ✅ Initial greeting message
function greetUser() {
  appendBotMessage("👋 Hi! I'm your AI Finance Assistant. How can I help you today?");
}

// ✅ Quick reply buttons
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

// ✅ Handle user input from button or manual input
function handleUserInput(message) {
  appendUserMessage(message);
  showTypingIndicator();
  sendMessageToBot(message);
}

// ✅ Append user and bot messages to chat
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

// ✅ Typing indicator
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

// ✅ Send message to backend
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

// ✅ Check admin access on load (used in login.html)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function checkAdminAccessOnLoad() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = parseJwt(token);
  if (payload && payload.role === "admin") {
    // ✅ Token says user is admin
    window.location.href = "admin.html";
  } else {
    console.log("✅ Logged in as regular user.");
  }
}

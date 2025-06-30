
const API_URL = 'https://ai-finance-assistant-muwh.onrender.com';
let token = '';

function navigateTo(sectionId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.documentElement.toggleAttribute("data-theme");
});

async function register() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  alert(data.msg);
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.access_token) {
    token = data.access_token;
    alert('Login successful!');
    navigateTo('chat');
  } else {
    alert(data.msg);
  }
}

async function sendMessage() {
  const message = document.getElementById('userMessage').value;
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await res.json();
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  chatBox.innerHTML += `<div><strong>Bot:</strong> ${data.response}</div>`;
  document.getElementById('userMessage').value = '';
}

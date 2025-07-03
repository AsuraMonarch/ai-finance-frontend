const API_URL = 'https://ai-finance-backend-1.onrender.com/'; // Use your actual backend URL
let token = '';

// Register handler
async function handleRegister() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  alert(data.msg || "Registration complete.");
}

// Login handler
async function handleLogin() {
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
  } else {
    alert(data.msg || "Login failed.");
  }
}

// Chat handler
async function handleChat() {
  const message = document.getElementById('userMessage').value;
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  const data = await res.json();
  alert("Bot: " + data.response);
}

// Add Transaction handler
async function handleAddTransaction() {
  const date = document.getElementById('transDate').value;
  const category = document.getElementById('transCategory').value;
  const amount = parseFloat(document.getElementById('transAmount').value);
  const res = await fetch(`${API_URL}/add_transaction`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ date, category, amount })
  });
  const data = await res.json();
  alert(data.status || "Transaction added.");
}
async function loadReport() {
  const token = localStorage.getItem("token") || token;
  if (!token) {
    alert("You must be logged in.");
    return;
  }

  const response = await fetch(`${API_URL}/transactions`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  const tbody = document.querySelector("#reportTable tbody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const row = `
      <tr>
        <td style="border: 1px solid #ccc; padding: 0.5rem;">${item.date}</td>
        <td style="border: 1px solid #ccc; padding: 0.5rem;">${item.category}</td>
        <td style="border: 1px solid #ccc; padding: 0.5rem;">₦${item.amount}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}
function showSuccess(message) {
  alert("✅ " + message);
}

function showError(message) {
  alert("❌ " + message);
}


document.getElementById('themeSwitch').addEventListener('change', function () {
  document.body.classList.toggle('dark-mode', this.checked);
  localStorage.setItem('darkMode', this.checked);
});

window.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', isDark);
  document.getElementById('themeSwitch').checked = isDark;
});

// Draw sample spending chart
window.addEventListener('load', () => {
  const ctx = document.getElementById('budgetChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Others'],
      datasets: [{
        label: 'Expenses Breakdown',
        data: [30000, 12000, 8000, 10000, 4000],
        backgroundColor: [
          '#36A2EB',
          '#FF6384',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Your Spending Distribution'
        }
      }
    }
  });
});

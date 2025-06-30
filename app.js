async function checkTransactions() {
  if (!token) {
    alert("You must be logged in first.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch transactions");

    const data = await res.json();
    console.log("Transactions:", data);
    alert("Transactions fetched successfully. Check console.");
  } catch (err) {
    console.error(err);
    alert("Error fetching transactions. See console.");
  }
}

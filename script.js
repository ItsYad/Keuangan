let transactions = [];
let totalBalance = 0;
let budgetLimit = null;
let reminders = ["Bayar kos", "Bayar listrik", "Bayar internet"];
let currentMonth = new Date().getMonth();

function addTransaction() {
  let desc = document.getElementById("desc").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let type = document.getElementById("type").value;

  if (desc === "" || isNaN(amount)) {
    alert("Masukkan data yang valid!");
    return;
  }

  let transaction = { desc, amount, type };
  transactions.push(transaction);
  updateTransactions();
  updateBalance();
  updateSummary();
}

function updateTransactions() {
  let transactionList = document.getElementById("transaction-list");
  transactionList.innerHTML = "";
  transactions.forEach((t, index) => {
    transactionList.innerHTML += `
            <tr>
                <td>${t.desc}</td>
                <td>${t.amount}</td>
                <td>${t.type}</td>
                <td>
                    <button onclick="editTransaction(${index})">Edit</button>
                    <button onclick="deleteTransaction(${index})">Hapus</button>
                </td>
            </tr>
        `;
  });
}

function editTransaction(index) {
  let newDesc = prompt("Edit Deskripsi:", transactions[index].desc);
  let newAmount = parseFloat(
    prompt("Edit Jumlah:", transactions[index].amount)
  );

  if (newDesc && !isNaN(newAmount)) {
    transactions[index].desc = newDesc;
    transactions[index].amount = newAmount;
    updateTransactions();
    updateBalance();
    updateSummary();
  }
}

function updateBalance() {
  totalBalance = transactions.reduce(
    (acc, t) => (t.type === "income" ? acc + t.amount : acc - t.amount),
    0
  );
  document.getElementById(
    "total-balance"
  ).textContent = `Saldo: ${totalBalance}`;

  if (budgetLimit && totalBalance < budgetLimit * 0.2) {
    alert("Peringatan: Saldo mendekati batas minimum budget!");
  }
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateTransactions();
  updateBalance();
  updateSummary();
}

function setBudget() {
  budgetLimit = prompt("Masukkan batas budget: ");
  document.getElementById(
    "budget-info"
  ).textContent = `Batas budget: ${budgetLimit}`;
}

function loadReminders() {
  let reminderList = document.getElementById("reminder-list");
  reminderList.innerHTML = "";
  reminders.forEach((reminder, index) => {
    reminderList.innerHTML += `
            <li>
                ${reminder} <button onclick="markPaid(${index})">✔</button>
            </li>
        `;
  });
}

function markPaid(index) {
  reminders.splice(index, 1);
  loadReminders();
}

function updateSummary() {
  let month = new Date().getMonth();
  if (month !== currentMonth) {
    transactions = [];
    currentMonth = month;
    updateTransactions();
  }
  let income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  let expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  document.getElementById(
    "summary-info"
  ).textContent = `Pemasukan: ${income}, Pengeluaran: ${expense}`;
}

function exportToExcel() {
  let csvContent = "Deskripsi,Jumlah,Tipe\n";
  transactions.forEach((t) => {
    csvContent += `${t.desc},${t.amount},${t.type}\n`;
  });

  let blob = new Blob([csvContent], { type: "text/csv" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "keuangan.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPDF() {
  let doc = new jsPDF();
  doc.text("Ringkasan Keuangan", 10, 10);
  let y = 20;
  transactions.forEach((t, index) => {
    doc.text(`${index + 1}. ${t.desc} - ${t.amount} (${t.type})`, 10, y);
    y += 10;
  });
  doc.save("keuangan.pdf");
}

document.addEventListener("DOMContentLoaded", () => {
  loadReminders();
  updateSummary();
});

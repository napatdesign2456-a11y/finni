// 📦 โหลดข้อมูลจาก LocalStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let isPro = localStorage.getItem("pro") === "true";

// 📌 อ้างอิง DOM (สำคัญมาก)
const transactionList = document.getElementById("transactionList");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const profit = document.getElementById("profit");
const balance = document.getElementById("balance");

// 💾 SAVE DATA
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("pro", isPro);
}

// ➕ ADD INCOME
function addIncome() {
  if (!checkLimit()) return;

  const name = prompt("ชื่อรายการ");
  const amount = parseFloat(prompt("จำนวนเงิน"));

  if (!name || isNaN(amount)) return;

  transactions.push({ name, amount, type: "income" });
  saveData();
  updateUI();
}

// ➖ ADD EXPENSE
function addExpense() {
  if (!checkLimit()) return;

  const name = prompt("ชื่อรายการ");
  const amount = parseFloat(prompt("จำนวนเงิน"));

  if (!name || isNaN(amount)) return;

  transactions.push({ name, amount, type: "expense" });
  saveData();
  updateUI();
}

// 🔒 FREE LIMIT
function checkLimit() {
  if (!isPro && transactions.length >= 10) {
    alert("ใช้ฟรีครบ 10 รายการแล้ว กรุณาอัปเกรด Pro");
    showPaymentOptions();
    return false;
  }
  return true;
}

// 💰 PAYMENT OPTIONS (PromptPay)
function showPaymentOptions() {
  const choice = confirm(
    "เลือกแพ็กเกจ:\n\nOK = รายเดือน (50 บาท)\nCancel = รายปี (500 บาท)"
  );

  if (choice) {
    window.open("https://promptpay.io/0803594656/50", "_blank");
  } else {
    window.open("https://promptpay.io/0803594656/500", "_blank");
  }
}

// 💳 CONFIRM PAYMENT
function confirmPayment() {
  const confirmPay = confirm("คุณชำระเงินแล้วใช่ไหม?");

  if (confirmPay) {
    isPro = true;
    saveData();
    alert("🎉 เปิดใช้งาน Pro สำเร็จ!");
  }
}

// 📊 UPDATE UI
function updateUI() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactionList.innerHTML = "";

  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.innerText = `${t.name} - ฿${t.amount}`;
    transactionList.appendChild(li);

    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  income.innerText = "฿" + totalIncome;
  expense.innerText = "฿" + totalExpense;

  const total = totalIncome - totalExpense;
  profit.innerText = "฿" + total;
  balance.innerText = "฿" + total;
}

// 🚀 START APP
updateUI();
// 🔥 ใส่ Firebase Config ของคุณ
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let user = null;
let transactions = [];
let isPro = false;

// 🔐 REGISTER
function register() {
  auth.createUserWithEmailAndPassword(
    email.value,
    password.value
  )
  .then(() => alert("สมัครสำเร็จ"))
  .catch(err => alert(err.message));
}

// 🔐 LOGIN
function login() {
  auth.signInWithEmailAndPassword(
    email.value,
    password.value
  )
  .then(() => alert("เข้าสู่ระบบแล้ว"))
  .catch(err => alert(err.message));
}

// 🔓 LOGOUT
function logout() {
  auth.signOut();
}

// 👀 CHECK LOGIN
auth.onAuthStateChanged(async (u) => {
  if (u) {
    user = u;
    loginBox.style.display = "none";
    mainApp.style.display = "block";
    await loadData();
  } else {
    loginBox.style.display = "block";
    mainApp.style.display = "none";
  }
});

// 📦 LOAD DATA
async function loadData() {
  const doc = await db.collection("users").doc(user.uid).get();

  if (doc.exists) {
    const data = doc.data();
    transactions = data.transactions || [];
    isPro = data.pro || false;
  }

  updateUI();
}

// 💾 SAVE DATA
function saveData() {
  db.collection("users").doc(user.uid).set({
    transactions,
    pro: isPro
  });
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

// 💰 SHOW PAYMENT OPTIONS
function showPaymentOptions() {
  const choice = confirm(
    "เลือกแพ็กเกจ:\n\nOK = รายเดือน (50 บาท)\nCancel = รายปี (500 บาท)"
  );

  if (choice) {
    // รายเดือน
    window.open("https://promptpay.io/0803594656/50", "_blank");
  } else {
    // รายปี
    window.open("https://promptpay.io/0803594656/500", "_blank");
  }
}

// 💳 MANUAL CONFIRM PAYMENT
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
  let income = 0;
  let expense = 0;

  transactionList.innerHTML = "";

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.innerText = `${t.name} - ฿${t.amount}`;
    transactionList.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  incomeText(income);
  expenseText(expense);
  profitText(income - expense);
}

// 🧾 UI HELPERS
function incomeText(val) {
  income.innerText = "฿" + val;
}

function expenseText(val) {
  expense.innerText = "฿" + val;
}

function profitText(val) {
  profit.innerText = "฿" + val;
  balance.innerText = "฿" + val;
}
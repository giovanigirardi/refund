const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

amount.oninput = function () {
  const valueWithoutLetters = amount.value.replace(/\D/g, "");
  const numericValue = Number(valueWithoutLetters) / 100;
  const formattedValue = formatCurrencyBRL(numericValue);

  amount.value = formattedValue;
}

form.onsubmit = function (e) {
  e.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    amount: amount.value,
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    created_at: new Date(),
  }

  addExpense(newExpense);
}

expenseList.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-icon")) {
    e.target.parentElement.remove();
    updateTotals();
  }
})

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

function addExpense(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;
    expenseInfo.appendChild(expenseName);
    expenseInfo.appendChild(expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`;

    const removeIcon = document.createElement("img");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");
    removeIcon.classList.add("remove-icon");

    expenseItem.appendChild(expenseIcon);
    expenseItem.appendChild(expenseInfo);
    expenseItem.appendChild(expenseAmount);
    expenseItem.appendChild(removeIcon);

    expenseList.appendChild(expenseItem);

    updateTotals();
    clearForm();
  } catch (error) {
    alert("Não foi possível adicionar a despesa. Tente novamente mais tarde.")
    console.error(error);
  }
}

function updateTotals() {
  try {
    const items = expenseList.children;

    let total = 0;
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount").textContent;
      const value = itemAmount.replace(/[^\d,]/g, "").replace(",", ".");
      const numericValue = parseFloat(value);

      if (isNaN(numericValue)) {
        return alert("Não foi possível atualizar os totais. Tente novamente mais tarde.");
      }

      total += numericValue;
    }

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expensesQuantity.textContent = `${items.length} ${items.length === 1 ? "despesa" : "despesas"}`;
    expensesTotal.innerHTML = "";
    expensesTotal.appendChild(symbolBRL);
    expensesTotal.innerHTML += total;
  } catch (error) {
    alert("Não foi possível atualizar os totais. Tente novamente mais tarde.")
    console.error(error);
  }
}

function clearForm() {
  amount.value = "";
  expense.value = "";
  category.value = "";
  expense.focus();
}
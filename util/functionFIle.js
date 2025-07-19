const { readFileSync, writeFileSync, existsSync } = require("fs");

function addExpense(
  description,
  category,
  amount,
  expenseDataPath,
  allExpenseData
) {
  const expenseSchema = {
    id: getId(allExpenseData),
    description: description,
    category: category,
    amount: amount,
    dateCreated: new Date().toLocaleString(),
    dateUpdated: new Date().toLocaleString(),
  };
  allExpenseData = [...allExpenseData, expenseSchema];
  writeFileSync(expenseDataPath, JSON.stringify(allExpenseData));
}

function getAllExpenses(expenseDataPath) {
  const file = readFileSync(expenseDataPath, "utf-8");
  if (file.length === 0) {
    return [];
  } else {
    let allTasks = JSON.parse(file);
    return allTasks;
  }
}

function listAllExpense(allExpenseData) {
  try {
    if (allExpenseData.length === 0) {
      console.log("No expenses found.");
      return;
    }

    // Define fields and headers
    const fields = [
      { key: "id", label: "ID" },
      { key: "description", label: "Description" },
      { key: "category", label: "Category" },
      { key: "amount", label: "Amount" },
      { key: "dateCreated", label: "Date Created" },
      { key: "dateUpdated", label: "Date Updated" },
    ];

    // Calculate column widths
    const widths = fields.map((field) =>
      Math.max(
        field.label.length,
        ...allExpenseData.map((row) =>
          row[field.key] ? row[field.key].toString().length : 0
        )
      )
    );

    // Header row
    const headerRow = fields
      .map((field, i) => field.label.padEnd(widths[i]))
      .join("  ");

    // Separator row
    const separatorRow = widths.map((w) => "-".repeat(w)).join("  ");

    // Data rows
    const dataRows = allExpenseData.map((row) =>
      fields
        .map((field, i) =>
          row[field.key]
            ? row[field.key].toString().padEnd(widths[i])
            : "".padEnd(widths[i])
        )
        .join("  ")
    );

    // Print table
    console.log(headerRow);
    console.log(separatorRow);
    console.log(dataRows.join("\n"));
  } catch (error) {
    console.error("Error listing all expenses:", error);
  }
}

function viewSummary(allExpenseData) {
  try {
    const summary = allExpenseData.reduce((expenseTotal, data) => {
      expenseTotal += Number(data.amount);
      return expenseTotal;
    }, 0);
    console.log(`Total Expense:  ₦${summary.toFixed(2)}`);
  } catch (error) {
    console.error("Error calculating summary:", error);
  }
}

function deleteExpense(itemId, allExpenseData, expenseDataPath) {
  try {
    const newExpenseData = allExpenseData.filter((data) => {
      return data.id !== Number(itemId);
    })    
    writeFileSync(expenseDataPath, JSON.stringify(newExpenseData));
    console.log(`Expense with ID ${itemId} has been deleted.`);
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}

function viewSummaryByMonth(summaryByMonth, allExpenseData) {
  try {
    const filteredMonthlySummary = allExpenseData.filter((data) => {
      // because .getMonth() starts from 0 we'll minus it by one before comparing
      return (
        new Date(data.dateCreated).getMonth() === Number(summaryByMonth) - 1
      );
    });

    const reducedMonthlySummary = filteredMonthlySummary.reduce(
      (monthlySum, monthlyData) => {
        monthlySum += Number(monthlyData.amount)
        return monthlySum;
      },
      0
    );
    const monthName = new Date(0, Number(summaryByMonth)-1).toLocaleString("en-US", { month: "long" });
    console.log(`Total Expenses for ${monthName}: ${reducedMonthlySummary}`);
  } catch (error) {
    console.log("Error viewing summary by month:", error);
  }
}

// Implement this extra functions to the project to make it better
function updateExpense() {
}


function setBudgetForMonth() {
  console.log("set budget for month");
}

function budgetExceeded() {
  console.log("budget Exceeded");
}

// to give a new id to the task
// i'm using this serially easy way for id assigning so users will be able to easily use the id's
function getId(allExpenseData) {
  if (allExpenseData.length === 0) {
    return 1;
  } else {
    index = allExpenseData.length - 1;
    neededObject = allExpenseData[index];
    return neededObject.id + 1;
  }
}

module.exports = {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  listAllExpense,
  viewSummary,
  viewSummaryByMonth,
  setBudgetForMonth,
  budgetExceeded,
};

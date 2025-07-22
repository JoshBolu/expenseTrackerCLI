const { readFileSync, writeFileSync, existsSync } = require("fs");

function addExpense(
  description,
  category,
  amount,
  expenseDataPath,
  allExpenseData
) {
  try {
    if (!description || !category || !amount) {
      throw new Error(
        "Description, category, and amount are required to add an expense."
      );
    }
    if (typeof amount !== "number" && isNaN(amount)) {
      throw new Error("Amount must be a number.");
    }
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
  } catch (error) {
    console.error(
      "Error adding expense:",
      error.message ? error.message : error
    );
  }
}

function getAllExpenses(expenseDataPath) {
  try {
    const file = readFileSync(expenseDataPath, "utf-8");
    if (file.length === 0) {
      return [];
    } else {
      let allTasks = JSON.parse(file);
      return allTasks;
    }
  } catch (error) {
    console.error(
      "Error getting expenses:",
      error.message ? error.message : error
    );
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
  if(!itemId){
    throw new Error("Item ID is required to delete an expense.");
  }
  try {
    const newExpenseData = allExpenseData.filter((data) => {
      return data.id !== Number(itemId);
    });
    writeFileSync(expenseDataPath, JSON.stringify(newExpenseData));
    console.log(`Expense with ID ${itemId} has been deleted.`);
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}

function viewSummaryByMonth(summaryByMonth, allExpenseData) {
  try {
    if (!summaryByMonth) {
      throw new Error("Month number is required to view summary by month.");  
    }
    // use chaining as we want to perform double array manipulation technique
    const filteredMonthlySummary = allExpenseData
      .filter((data) => {
        // because .getMonth() starts from 0 we'll minus it by one before comparing
        return (
          new Date(data.dateCreated).getMonth() === Number(summaryByMonth) - 1
        );
      })
      .reduce((monthlySum, monthlyData) => {
        monthlySum += Number(monthlyData.amount);
        return monthlySum;
      }, 0)
      .toFixed(2);

    return filteredMonthlySummary;
  } catch (error) {
    console.log("Error viewing summary by month:", error);
  }
}

function updateExpense(
  itemId,
  allExpenseData,
  expenseDataPath,
  description,
  category,
  amount
) {
  try {
    // checks if itemId is provided as it is essential for updating
    if(!itemId) {
      throw new Error("Item ID is required to update an expense.");
    }
    // checks if at least one field is provided for update
    if (!description && !category && !amount) {
      throw new Error(
        "At least one field (description, category, amount) must be provided for update."
      );
    }
    // check if the itemId is is a number
    if (typeof amount !== "number" && isNaN(amount)) {
      throw new Error("Amount must be a number.");
    }
    const newAllExpenseData = allExpenseData.map((data) => {
      if (data.id === Number(itemId)) {
        return {
          ...data,
          description: description ? description : data.description,
          category: category ? category : data.category,
          amount: amount ? amount : data.amount,
          dateUpdated: new Date().toLocaleString(),
        };
      }
      return data;
    });
    writeFileSync(expenseDataPath, JSON.stringify(newAllExpenseData));
    console.log(`Expense with ID ${itemId} has been updated.`);
  } catch (error) {
    console.error(
      "Error updating expense:",
      error.message ? error.message : error
    );
  }
}

function setBudgetForMonth(budgetForMonth, budgetPath) {
  try {
    // checks if budget is provided
    if (!budgetForMonth) {
      throw new Error("Budget for the month must be provided.");
    }
    const budgetData = {
      budget: budgetForMonth,
      dateSet: new Date().toLocaleString(),
    };
    if (!budgetForMonth) {
      throw new Error("Budget for the month must be provided.");
    }
    writeFileSync(budgetPath, JSON.stringify(budgetData));
  } catch (error) {
    console.error(
      "Error setting budget for month:",
      error.message ? error.message : error
    );
  }
}

// checks if budget per month is currently for this month if not it would request User to change budget as previous one has expired
function checkBudgetPerMonth(budgetPath) {
  try {
    let monthBudget = readFileSync(budgetPath, "utf-8");
    monthBudget = JSON.parse(monthBudget);
    const monthBudgetDate = new Date(monthBudget.dateSet);
    const currentDate = new Date();
    if (monthBudgetDate.getMonth() !== currentDate.getMonth()) {
      // if the month is not the same as the current month then we would write a new budget
      writeFileSync(
        budgetPath,
        JSON.stringify({ budget: "0", dateSet: new Date().toLocaleString() })
      );
      throw new Error("Set new Monthly budget as Previous one has expired");
    }
  } catch (error) {
    console.log("Error:", error.message ? error.message : error);
  }
}

// checks if the budget is exceeded
// this function is not currently used in the code but soon
function budgetExceeded(budgetAmount, budgetPath) {
  try {
    let budget = readFileSync(budgetPath, "utf-8");
    budget = JSON.parse(budget);
    budget = Number(budget.budget);
    if (budgetAmount > budget) {
      console.log(
        `Budget exceeded! You have spent ₦${budgetAmount} which is more than your budget of ₦${budget}.`
      );
    } else if (budgetAmount < budget && budgetAmount > budget - budget * 0.1) {
      console.log(
        `You are close to your budget of ₦${budget}.\nYou've spent ${budgetAmount} Spend Wisely!`
      );
    } else {
      return;
    }
  } catch (error) {
    console.error(
      "Error checking if budget is exceeded:",
      error.message ? error.message : error
    );
  }
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
  checkBudgetPerMonth,
};
const { readFileSync, writeFileSync } = require("fs");

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

// function listAllExpense(allExpenseData) {
//   try {
//     if (allExpenseData.length === 0) {
//       console.log("No expenses found.");
//       return;
//     } else {
//       // Define headers
//       const headers = [
//         "ID",
//         "Description",
//         "Category",
//         "Amount",
//         "Date Created",
//         "Date Updated",
//       ];

//       // Calculate maximum width for each column
//       const widths = headers.map((header, index) => {
//         const columnValues = allExpenseData.map((row, key) => {
//           if (index === 0) return row.id.toString();
//           if (index === 1) return row.description;
//           if (index === 2) return row.category;
//           if (index === 3) return row.amount;
//           if (index === 4) return row.dateCreated;
//           if (index === 5) return row.dateUpdated;
//         });
//         return Math.max(
//           header.length,
//           ...columnValues.map((val) => val.length)
//         );
//       });
//       // Create header row
//       const headerRow = headers
//         .map((header, index) => header.padEnd(widths[index]))
//         .join("  ");
//       // Create separator row
//       const separatorRow = widths.map((width) => "-".repeat(width)).join("  ");
//       // Create data rows
//       const dataRows = allExpenseData.map((row) => {
//         return [
//           row.id.toString().padEnd(widths[0]),
//           row.description.padEnd(widths[1]),
//           row.category.padEnd(widths[2]),
//           row.amount.padEnd(widths[3]),
//           row.dateCreated.padEnd(widths[4]),
//           row.dateUpdated.padEnd(widths[5]),
//         ].join("  ");
//       });

//       // Print the table
//       console.log(headerRow);
//       console.log(separatorRow);
//       console.log(dataRows.join("\n"));
//     }
//   } catch (error) {
//     console.error("Error listing all expenses:", error);
//   }
// }
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

function updateExpense() {
  
}

function deleteExpense() {
  console.log("delete Expense");
}
function viewSummary() {
  console.log("view Summary");
}

function viewSummaryByMonth() {
  console.log("view Summary by month");
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

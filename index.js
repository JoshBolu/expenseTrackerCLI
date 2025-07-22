const { program } = require("commander");
const path = require("path");
const {
  addExpense,
  getAllExpenses,
  listAllExpense,
  viewSummary,
  updateExpense,
  deleteExpense,
  viewSummaryByMonth,
  setBudgetForMonth,
  checkBudgetPerMonth,
  budgetExceeded,
} = require("./util/functionFIle.js");

// Always put space between the flag and the placeholder<>
program
  .name("expenseTrackerCLI")
  .argument(
    "<action>",
    "add, list, summary, delete, summaryByMonth, update, setBudgetForMonth"
  )
  .option("-d, --description <descr>", "What you want to purchase")
  .option("-c, --category <cate>", "Group all your purchase under category")
  .option("-a,--amount <number>", "Price spent on the purchase")
  .option("-i, --id <id>", "Id of the item you want to select")
  .option("-m, --summaryByMonth <month>", "View summary by month")
  .option("-s, --setBudgetForMonth <budget>", "Set budget for the month")
  .parse();

const options = program.opts(); // to get the options (e.g. --limit)
let description = options.description;
let category = options.category;
let amount = options.amount;
let itemId = options.id;
let summaryByMonth = options.summaryByMonth;
let budgetForMonth = options.setBudgetForMonth;
const action = program.args[0]; // to get the first argument

// define the path using the fs module so it would be relative to the ,achine
const expenseDataPath = path.join(__dirname, "data", "expenseData.json");
const budgetPath = path.join(__dirname, "data", "budget.json");

// define data as an empty array on initialization so we know it's empty
let allExpenseData = [];
allExpenseData = getAllExpenses(expenseDataPath);
// console.log(budgetForMonth)

// call for budget checker
checkBudgetPerMonth(budgetPath);

// we'll use switch statements for the logic of the project
try {
  switch (action) {
    case "add":
      addExpense(
        description,
        category,
        amount,
        expenseDataPath,
        allExpenseData
      );
      break;
    case "list":
      listAllExpense(allExpenseData);
      break;
    case "summary":
      viewSummary(allExpenseData);
      break;
    case "delete":
      deleteExpense(itemId, allExpenseData, expenseDataPath);
      break;
    case "summaryByMonth":
      let filteredMonthlySummary = viewSummaryByMonth(
        summaryByMonth,
        allExpenseData
      );
      // for getting the month for the corresponding month number
      const monthName = new Date(0, Number(summaryByMonth) - 1).toLocaleString(
        "en-US",
        { month: "long" }
      );
      console.log(
        `Total Expenses for ${monthName}: ₦${filteredMonthlySummary}`
      );
      break;
    case "update":
      updateExpense(
        itemId,
        allExpenseData,
        expenseDataPath,
        description,
        category,
        amount
      );
      break;
    case "setBudgetForMonth":
      setBudgetForMonth(budgetForMonth, budgetPath);
      break;
    default:
      console.log(
        `The action ${action} is not avaiable please read the READme file`
      );
  }
} catch (error) {
  console.log(error);
}

// call for budget checker
checkBudgetPerMonth(budgetPath);

// for checking if the budget is exceeded per month
if (
  action === "list" ||
  action === "summary" ||
  action === "add" ||
  action === "update"
) {
  // get the current month
  let currentMonth = new Date().getMonth() + 1
  let budgetAmountForMonth = viewSummaryByMonth(currentMonth, allExpenseData);
  budgetExceeded(budgetAmountForMonth, budgetPath);
}

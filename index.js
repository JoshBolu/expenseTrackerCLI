const { program } = require("commander");
const path = require("path");
const { addExpense, getAllExpenses, listAllExpense } = require('./util/functionFIle.js')


// Always put space between the flag and the placeholder<>
program
  .name("expenseTrackerCLI")
  .argument("<action>", "add, list, summary, delete, setBudgetForMonth")
  .option("-d, --description <descr>", "What you want to purchase")
  .option("-c, --category <cate>", "Group all your purchase under category")
  .option("-a,--amount <number>", "Price spent on the purchase")
  .parse();

const options = program.opts(); // to get the options (e.g. --limit)
let description = options.description 
let category = options.category
let amount = options.amount
const action = program.args[0]; // to get the first argument

// define the path using the fs module so it would be relative to the ,achine
const expenseDataPath = path.join(__dirname, "expenseData.json");

// define data as an empty array on initialization so we know it's empty
let allExpenseData = []
allExpenseData = getAllExpenses(expenseDataPath);
// console.log(allExpenseData)


// we'll use switch statements for the logic of the project
switch(action){
    case "add":
        addExpense(description, category, amount, expenseDataPath, allExpenseData);
        break;
    case "list":
        listAllExpense(allExpenseData);
        break;
    default:
        console.log(`The action ${action} is not avaiable please read the READme file`);
}
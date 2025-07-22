# Expense Tracker CLI

A simple Node.js command-line application for tracking expenses, viewing summaries, and managing monthly budgets.

---

## Features

- **Add Expenses**: Log new expenses with description, category, and amount.
- **List Expenses**: View all recorded expenses in a formatted table.
- **Summary**: See the total amount spent.
- **Delete Expense**: Remove an expense by its ID.
- **Update Expense**: Edit details of an existing expense.
- **Monthly Summary**: View total expenses for a specific month.
- **Set Monthly Budget**: Set a budget for the current month.
- **Budget Alerts**: Get notified when you are close to or exceed your budget.

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/expenseTrackerCLI.git
   cd expenseTrackerCLI
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

---

## Usage

Run the CLI using Node.js:

```sh
node index.js <action> [options]
```

### Actions & Options

| Action                | Description                                      | Required Options                      |
|-----------------------|--------------------------------------------------|---------------------------------------|
| `add`                 | Add a new expense                                | `-d`, `-c`, `-a`                      |
| `list`                | List all expenses                                | None                                  |
| `summary`             | Show total expenses                              | None                                  |
| `delete`              | Delete an expense by ID                          | `-i`                                  |
| `update`              | Update an expense by ID                          | `-i` plus any of `-d`, `-c`, `-a`     |
| `summaryByMonth`      | Show expenses for a specific month               | `-m`                                  |
| `setBudgetForMonth`   | Set monthly budget                               | `-s`                                  |

### Options

- `-d, --description <descr>`: Description of the expense
- `-c, --category <cate>`: Category for the expense
- `-a, --amount <number>`: Amount spent
- `-i, --id <id>`: Expense ID
- `-m, --summaryByMonth <month>`: Month number (1-12)
- `-s, --setBudgetForMonth <budget>`: Budget amount for the month

---

### Examples

#### Add an Expense

```sh
node index.js add -d "Lunch" -c "Food" -a 15.5
```

#### List All Expenses

```sh
node index.js list
```

#### View Total Summary

```sh
node index.js summary
```

#### Delete an Expense

```sh
node index.js delete -i 3
```

#### Update an Expense

```sh
node index.js update -i 2 -d "Dinner" -a 20
```

#### View Monthly Summary

```sh
node index.js summaryByMonth -m 7
```

#### Set Monthly Budget

```sh
node index.js setBudgetForMonth -s 1000
```

---

## Data Storage

- Expenses are stored in `data/expenseData.json`.
- Budget is stored in `data/budget.json`.

---

## Notes

- Amounts should be numbers (e.g., `-a 25.50`).
- Month numbers are 1 (January) to 12 (December).
- The CLI checks your budget after every add, update, list, or summary action.

---

## Troubleshooting

- If you see errors about missing files, ensure the `data` directory exists.
- For "Budget expired" messages, set a new budget using `setBudgetForMonth`.

---

## License

MIT

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss changes.

## Project Url
https://roadmap.sh/projects/expense-tracker

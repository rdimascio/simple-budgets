import chalk from 'chalk';

export default `
  Simple Budgets is open-source, MIT licensed budgeting software that doesn't store or track your data. Free to use. Free to extend.

  ${chalk.bold('Usage')}

  ${chalk.dim('$')} budget [command]

  ${chalk.bold('Commands')}

      config   Configure your user credentials
      add      Create an account, expense, income, category, or budget
      import   Import a local or external CSV file of transactions

  ${chalk.bold('Examples')}

      Setup a new budget instance
      ${chalk.dim('$')} budget config

      Create a new expense
      ${chalk.dim('$')} budget add expense --amount=14.99 --name="Chipotle" --category="Food & Drink"
`;

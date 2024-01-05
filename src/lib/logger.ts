import * as chalk from "chalk";

const logger = {
  error: (message: string) => {
    console.log(chalk.red.underline.bold("ERROR") + " " + chalk.red(message));
  },
  success: (message: string) => {
    console.log(chalk.green.underline.bold("SUCCESS") + " " + chalk.green(message));
  },
  alert: (message: string) => {
    console.log(chalk.yellow.underline.bold("ALERT") + " " + chalk.yellow(message));
  },
};

export default logger;

import * as chalk from "chalk";

export const loggerMessage = {
  error: (message: string) => {
    return chalk.red.underline.bold("ERROR") + " " + chalk.red(message);
  },
  success: (message: string) => {
    return chalk.green.underline.bold("SUCCESS") + " " + chalk.green(message);
  },
  alert: (message: string) => {
    return chalk.yellow.underline.bold("ALERT") + " " + chalk.yellow(message);
  },
};

const logger = {
  error: (message: string) => {
    console.log(loggerMessage.error(message));
  },
  success: (message: string) => {
    console.log(loggerMessage.success(message));
  },
  alert: (message: string) => {
    console.log(loggerMessage.alert(message));
  },
};

export default logger;

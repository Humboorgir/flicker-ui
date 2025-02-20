import chalk from "chalk";

type LoggerOptions = {
  // if true, the message will not be prefixed with "SUCCESS", "ERROR", etc.
  raw?: boolean;
};

const defaultOptions = {
  raw: false,
};

// formats the string and returns it
export const loggerMessage = {
  error: (message: string, { raw }: LoggerOptions = defaultOptions) => {
    if (raw) return chalk.red(message);
    return chalk.red.underline.bold("ERROR") + " " + chalk.red(message);
  },

  success: (message: string, { raw }: LoggerOptions = defaultOptions) => {
    if (raw) return chalk.green(message);
    return chalk.green.underline.bold("SUCCESS") + " " + chalk.green(message);
  },

  alert: (message: string, { raw }: LoggerOptions = defaultOptions) => {
    if (raw) return chalk.yellow(message);
    return chalk.yellow.underline.bold("ALERT") + " " + chalk.yellow(message);
  },
};

// logs the formatted string to the console
const logger = {
  error: (message: string, { ...options }: LoggerOptions = defaultOptions) => {
    console.log(loggerMessage.error(message, { ...options }));
  },

  success: (message: string, { ...options }: LoggerOptions = defaultOptions) => {
    console.log(loggerMessage.success(message, { ...options }));
  },

  alert: (message: string, { ...options }: LoggerOptions = defaultOptions) => {
    console.log(loggerMessage.alert(message, { ...options }));
  },
};

export default logger;

import fs from "fs-extra";
import path from "node:path";
import chalk from "chalk";

import logger from "../../lib/logger";
import getConfig from "../../lib/getConfig";
import handleDependencies from "../../lib/handleDependencies";
import getDirname from "../../lib/getDirname";
import askForHooksFolderPath from "../initCommand/askForHooksFolderPath";
import stripFileExtension from "../stripFileExtension";

export default async function addHook(hookName: string) {
  const __dirname = getDirname();
  const packageFolder = fs.readdirSync(path.join(__dirname, ".."));
  const { hooksFolderPath } = getConfig();

  if (!hooksFolderPath) await askForHooksFolderPath();

  if (!packageFolder.includes("hooks")) {
    logger.error("Couldn't find hooks folder in installation, perhaps flicker-ui wasn't properly installed?");
  }

  // To handle case sensitivity, we find the hook's file in the hooks folder
  // and then use its file name to perform further operations
  const sourceFolder = fs.readdirSync(path.join(__dirname, "..", "hooks"));
  const sourceFile = sourceFolder.find((file) => {
    const fileName = stripFileExtension(file);
    return fileName.toLowerCase() == hookName.toLowerCase();
  });

  if (!sourceFile)
    return logger.error("Invalid hook name, to get a list of valid hooks use the 'list' command");

  const sourceFileName = stripFileExtension(sourceFile);
  const source = path.join(__dirname, "..", "hooks", `${sourceFileName}.ts`);
  const target = `${hooksFolderPath}/${sourceFileName}.ts`;

  try {
    fs.copySync(source, target, { overwrite: false, errorOnExist: true });
    await handleDependencies(sourceFile, "hook");
    logger.success(`Successfully installed the ${chalk.underline(sourceFileName)} hook`);
  } catch (e) {
    console.log(e);
    logger.error(
      `Failed to copy hook,\n hook ${chalk.underline(sourceFileName)} already exists in your project`
    );
  }
}

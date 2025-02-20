import { Command } from "commander";
import fs from "fs-extra";
import path from "node:path";
import chalk from "chalk";

import logger from "../lib/logger";
import getConfig from "../lib/getConfig";
import handleDependencies from "../lib/handleDependencies";
import getDirname from "../lib/getDirname";

const addCommand = new Command("add")
  .description("Adds the specified component to your project")
  .argument("<string>", "name of the component")
  .action(handleAddComponent);

async function handleAddComponent(component: string) {
  const __dirname = getDirname();
  const packageFolder = fs.readdirSync(path.join(__dirname, ".."));
  const { componentsFolderPath } = getConfig();

  if (!componentsFolderPath)
    return logger.error(
      "Couldn't find components folder path in config file. \n Try re-running 'flicker-ui init'"
    );

  if (!packageFolder.includes("components")) {
    logger.error(
      "Couldn't find components folder in installation, perhaps flicker-ui wasn't properly installed?"
    );
  }

  const sourceFolder = fs.readdirSync(path.join(__dirname, "..", "components"));
  const isValid = sourceFolder.includes(component.toLowerCase());

  if (!isValid)
    return logger.error(
      "Invalid component name, to get a list of valid components use the 'components' command"
    );

  const source = path.join(__dirname, "..", "components", component.toLowerCase());

  // TODO: this might break if componentsFolder has an extra "/" at the end of it
  // for instance: ./src/components/
  // fix it!
  const target = `${componentsFolderPath}/${component.toLowerCase()}`;

  try {
    fs.copySync(source, target, { overwrite: false, errorOnExist: true });
    await handleDependencies(component.toLowerCase());
    logger.success(`Successfully installed ${component} component`);
  } catch (e) {
    logger.error(
      `Failed to copy components,\n component ${chalk.underline(component)} already exists in your project`
    );
  }
}

export default addCommand;

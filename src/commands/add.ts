import { Command } from "commander";
import fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";

import logger from "../lib/logger";
import findComponentsFolder from "../lib/findComponentsFolder";
import handleDependencies from "../lib/handleDependencies";

const addCommand = new Command("add")
  .description("Adds the specified component to your project")
  .argument("<string>", "name of the component")
  .action(handleAddComponent);

async function handleAddComponent(component: string) {
  const packageFolder = await fs.readdirSync(path.join(__dirname, ".."));
  const componentsFolder = await findComponentsFolder();

  if (!packageFolder.includes("components")) {
    logger.error(
      "Couldn't find components folder in installation, perhaps the package wasn't properly installed?"
    );
  }

  const sourceFolder = await fs.readdirSync(path.join(__dirname, "..", "components"));
  const isValid = sourceFolder.includes(component.toLowerCase());

  if (!isValid)
    return logger.error(
      "Invalid component name, to get a list of valid components use the 'components' command"
    );

  const source = path.join(__dirname, "..", "components", component.toLowerCase());

  // TODO: this might break if componentsFolder has an extra "/" at the end of it
  // for instance: ./src/components/
  // fix it!
  const target = `${componentsFolder}/${component.toLowerCase()}`;

  try {
    fs.copySync(source, target, { overwrite: false, errorOnExist: true });
    handleDependencies(component.toLowerCase());
    logger.success(`Successfully installed ${component} component`);
  } catch (e) {
    logger.error(
      `Failed to copy components,\n component ${chalk.underline(component)} already exists in your project`
    );
  }
}

export default addCommand;

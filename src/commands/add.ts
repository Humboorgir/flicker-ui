import { Command } from "commander";
import fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";

import logger from "../lib/logger";

const addCommand = new Command("add")
  .description("Adds the specified component to your project")
  .argument("<string>", "name of the component")
  .action(handleAddComponent);

async function handleAddComponent(component: string) {
  const packageFolder = await fs.readdirSync(path.join(__dirname, ".."));
  const userFolder = await fs.readdirSync("./");

  if (!userFolder.includes("components")) return logger.error("Couldn't find your components folder");
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
  const target = `./components/${component.toLowerCase()}`;

  try {
    fs.copySync(source, target, { overwrite: false, errorOnExist: true });
    logger.success(`Successfully installed ${component} component`);
  } catch (e) {
    logger.error(
      `Failed to copy components,\n component ${chalk.underline(component)} already exists in your project`
    );
  }
}

export default addCommand;

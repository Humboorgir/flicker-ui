import { Command } from "commander";
import fs from "fs-extra";
import * as chalk from "chalk";
import * as path from "path";

const listCommand = new Command("list")
  .description("Displays the list of available components")
  .action(handleListComponents);

async function handleListComponents() {
  const components = fs.readdirSync(path.join(__dirname, "..", "components"));
  const componentsFormatted = components.join("\n");

  const packageVersion = await fs.readJsonSync(path.join(__dirname, "..", "package.json")).version;
  console.log(
    `${chalk.green.bold.underline(`FlickerUI @${packageVersion} components`)}\n${chalk.green(
      componentsFormatted
    )}`
  );
}

export default listCommand;

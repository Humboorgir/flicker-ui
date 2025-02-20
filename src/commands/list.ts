import { Command } from "commander";
import fs from "fs-extra";
import chalk from "chalk";
import path from "node:path";
import getDirname from "../lib/getDirname";

const listCommand = new Command("list")
  .description("Displays the list of available components")
  .action(handleListComponents);

async function handleListComponents() {
  const __dirname = getDirname();
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

#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs-extra";
import * as path from "path";

const program = new Command();

program.name("flicker-ui").description("Simple CLI to copy premade react components").version("1.0.0");

function log(message: string, type?: string) {
  console.log(message);
}

program
  .command("add")
  .description("Adds the specified component to your project")
  .argument("<string>", "name of the component")
  .action(handleAddComponent);

async function handleAddComponent(component: string) {
  const packageFolder = await fs.readdirSync(__dirname);
  const userFolder = await fs.readdirSync("./");

  if (!userFolder.includes("components")) return log("Couldn't find your components folder");
  if (!packageFolder.includes("component"))
    return log(
      "Couldn't find components folder in installation, perhaps the package wasn't properly installed?"
    );

  const componentsFolder = await fs.readdirSync("./components");
  const sourceFolder = await fs.readdirSync(path.join(__dirname, "components"));

  const alreadyAdded = componentsFolder.includes(component.toLowerCase());
  if (alreadyAdded) return log(`There's already a component called "${component}" in your project`);

  const isValid = sourceFolder.includes(component.toLowerCase());
  if (!isValid) return log("Invalid component name");

  fs.copySync(`${__dirname}/${component.toLowerCase()}`, `./components/${component.toLowerCase()}`);
}

program.parse();

#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs-extra";
import * as path from "path";

const program = new Command();

program.name("flicker-ui").description("Simple CLI to copy premade react components").version("1.0.0");

function log(message: any, type?: string) {
  console.log(message);
}

program
  .command("add")
  .description("Adds the specified component to your project")
  .argument("<string>", "name of the component")
  .action(handleAddComponent);

async function handleAddComponent(component: string) {
  const packageFolder = await fs.readdirSync(path.join(__dirname, ".."));
  const userFolder = await fs.readdirSync("./");

  if (!userFolder.includes("components")) return log("Couldn't find your components folder");
  if (!packageFolder.includes("components")) {
    log("Couldn't find components folder in installation, perhaps the package wasn't properly installed?");
    log(packageFolder);
  }

  const sourceFolder = await fs.readdirSync(path.join(__dirname, "..", "components"));
  const isValid = sourceFolder.includes(component.toLowerCase());

  if (!isValid) return log("Invalid component name");

  const source = path.join(__dirname, "..", "components", component.toLowerCase());
  const target = `./components/${component.toLowerCase()}`;

  try {
    fs.copySync(source, target, { overwrite: false, errorOnExist: true });
  } catch (e) {
    log(`Failed to copy components,\n component ${component} already exists in your project`);
  }
}

program.parse();

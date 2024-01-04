import { Command } from "commander";
import fs from "fs-extra";

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
  try {
    const compFolder = await fs.readdirSync("./components");
    const sourceFolder = await fs.readdirSync("./_components");

    const alreadyAdded = compFolder.includes(component.toLowerCase());
    if (alreadyAdded) return log(`There's already a component called "${component}" in your project`);

    const isValid = sourceFolder.includes(component.toLowerCase());
    if (!isValid) return log("Invalid component name");

    fs.copySync(`./components/${component.toLowerCase()}`, `./_components/${component.toLowerCase()}`);
  } catch (e: any) {
    if (e.errno == -2) return log("Couldn't find your components folder");
  }
}

program.parse();

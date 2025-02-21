import { Command } from "commander";
import addComponent from "../lib/addCommand/addComponent";
import addHook from "../lib/addCommand/addHook";

const addCommand = new Command("add")
  .description("Adds the specified component to your project")
  .argument("<string>", "name of the component")
  .option("--component", "install a component (default)")
  .option("--hook", "install a hook")
  .option("--utility", "install a utility")
  .action(handleAdd);

type Options = { component: boolean; hook: boolean; utility: boolean };
async function handleAdd(name: string, options: Options) {
  const { component: isComponent, hook: isHook, utility: isUtility } = options;

  if (isComponent) return addComponent(name);
  else if (isHook) return addHook(name);
  else return addComponent(name);
}

export default addCommand;

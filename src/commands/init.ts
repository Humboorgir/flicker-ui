import { Command } from "commander";
import askForComponentsFolderPath from "../lib/initCommand/askForComponentsFolderPath";
import askForHooksFolderPath from "../lib/initCommand/askForHooksFolderPath";
import askForPreferredPackageManager from "../lib/initCommand/askForPreferredPackageManager";

const initCommand = new Command("init").description("Initializes FlickerUI").action(handleInit);

async function handleInit() {
  await askForComponentsFolderPath();
  await askForHooksFolderPath();
  await askForPreferredPackageManager();
}

export default initCommand;

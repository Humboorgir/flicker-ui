import { Command } from "commander";
import askForComponentsFolderPath from "../lib/askForComponentsFolderPath";
import askForPreferredPackageManager from "../lib/askForPreferredPackageManager";

const initCommand = new Command("init").description("Initializes FlickerUI").action(handleInit);

async function handleInit() {
  await askForComponentsFolderPath();
  await askForPreferredPackageManager();
}

export default initCommand;

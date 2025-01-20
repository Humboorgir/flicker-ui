import logger, { loggerMessage } from "../lib/logger";
import { Command } from "commander";
import fs from "fs-extra";
import prompts from "prompts";
import saveConfig from "../lib/saveConfig";

const initCommand = new Command("init").description("Initializes FlickerUI").action(handleInit);

async function handleInit() {
  const userFolder = await fs.readdirSync("./");

  if (userFolder.includes("components")) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: loggerMessage.alert("Detected 'components' folder at project root. Set as default?"),
    });

    const componentsFolderPath = `./components`;
    if (confirm) {
      saveConfig({ componentsFolderPath: `${componentsFolderPath}/ui` });
      return;
    }
  }

  if (userFolder.includes("src") && fs.readdirSync("./src").includes("components")) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: loggerMessage.alert("Detected 'components' folder in src. Set as default?"),
    });

    const componentsFolderPath = `./src/components`;
    if (confirm) {
      saveConfig({ componentsFolderPath: `${componentsFolderPath}/ui` });
      return;
    }
  }

  // ask for components folder, then validate and save it.
  await getAndSaveComponentsFolder();

  async function getAndSaveComponentsFolder() {
    const hasSrc = userFolder.includes("src");
    const placeholder = hasSrc ? "./src/components" : "./components";
    const { value } = await prompts({
      type: "text",
      name: "value",
      initial: placeholder,
      message: "Enter a path to your components folder",
    });

    try {
      await fs.readdirSync(value);
    } catch (e) {
      logger.error(`Couldn't find a folder at ${value}, try again!`);
      // ask again
      return getAndSaveComponentsFolder();
    }

    saveConfig({ componentsFolderPath: `${value}/ui` });
  }
}

export default initCommand;

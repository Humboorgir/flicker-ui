import prompts from "prompts";
import logger, { loggerMessage } from "./logger";
import saveConfig from "./saveConfig";
import { readdirSync } from "node:fs";

export default async function askForComponentsFolderPath() {
  const userDirectories = readdirSync("./");
  const doesUserUseSrcDirectory = userDirectories.includes("src");

  if (userDirectories.includes("components")) {
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

  if (doesUserUseSrcDirectory && readdirSync("./src").includes("components")) {
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
    const placeholder = doesUserUseSrcDirectory ? "./src/components" : "./components";
    const { value } = await prompts({
      type: "text",
      name: "value",
      initial: placeholder,
      message: "Enter a path to your components folder",
    });

    try {
      readdirSync(value);
    } catch (e) {
      logger.error(`Couldn't find a folder at ${value}, try again!`);
      // ask again
      return getAndSaveComponentsFolder();
    }

    saveConfig({ componentsFolderPath: `${value}/ui` });
  }
}

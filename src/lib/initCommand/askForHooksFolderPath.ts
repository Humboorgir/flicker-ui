import prompts from "prompts";
import logger, { loggerMessage } from "../logger";
import saveConfig from "../saveConfig";
import { readdirSync } from "node:fs";

export default async function askForHooksFolderPath() {
  const userDirectories = readdirSync("./");
  const doesUserUseSrcDirectory = userDirectories.includes("src");

  if (userDirectories.includes("hooks")) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: loggerMessage.alert("Detected 'hooks' folder at project root. Set as default?"),
    });

    const hooksFolderPath = `./hooks`;
    if (confirm) {
      saveConfig({ hooksFolderPath });
      return;
    }
  }

  if (doesUserUseSrcDirectory && readdirSync("./src").includes("hooks")) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: loggerMessage.alert("Detected 'hooks' folder in src. Set as default?"),
    });

    const componentsFolderPath = `./src/hooks`;
    if (confirm) {
      saveConfig({ componentsFolderPath });
      return;
    }
  }

  // ask for hooks folder, then validate and save it.
  // if invalid, repeat the function
  await getAndGetHooksFolder();

  async function getAndGetHooksFolder() {
    const placeholder = doesUserUseSrcDirectory ? "./src/hooks" : "./hooks";
    const { value } = await prompts({
      type: "text",
      name: "value",
      initial: placeholder,
      message: "Enter the path to your hooks folder",
    });

    try {
      readdirSync(value);
    } catch (e) {
      logger.error(`Couldn't find a folder at ${value}, try again!`);
      // ask again
      return getAndGetHooksFolder();
    }

    saveConfig({ hooksFolderPath: value });
  }
}

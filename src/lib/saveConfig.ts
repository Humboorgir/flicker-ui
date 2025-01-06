import * as fs from "fs";
import logger from "./logger";

type Config = {
  componentsFolderPath: string;
};

function saveConfig({ componentsFolderPath }: Config) {
  const configToBeSaved = {
    componentsFolderPath,
  };

  const configToBeSavedString = JSON.stringify(configToBeSaved);

  try {
    fs.writeFileSync("flicker-config.json", configToBeSavedString, "utf8");

    return { ok: true };
  } catch (err) {
    logger.error(
      `Something went wrong whilst attempting to save config!\n Error: ${JSON.stringify(
        err
      )}`
    );
    return { ok: false };
  }
}

export default saveConfig;

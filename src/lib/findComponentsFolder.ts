import * as fs from "fs";
import logger, { loggerMessage } from "./logger";

export default async function findComponentsFolder() {
  const rootFolders = await fs.readdirSync("./");
  if (!rootFolders.includes("flicker-config.json"))
    throw new Error(
      loggerMessage.error(
        "Unable to find FlickerUI's config.\n Make sure to initialize FlickerUI with 'flicker-ui init' before using the CLI for anything"
      )
    );

  try {
    const config = await fs.readFileSync("./flicker-config.json", "utf8");
    const configJSON = JSON.parse(config);

    if (!configJSON.componentsFolderPath)
      return logger.error(
        "Couldn't find components folder path in config file. \n Try re-running 'flicker-ui init'"
      );
    const { componentsFolderPath } = configJSON;

    return componentsFolderPath;
  } catch (e) {
    logger.error(`Unable to read FlickerUI config file.\n Error: ${JSON.stringify(e)}`);
  }
}

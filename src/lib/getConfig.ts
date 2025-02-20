import { readdirSync, readFileSync } from "node:fs";
import logger, { loggerMessage } from "./logger";

export default function getConfig() {
  const rootFolders = readdirSync("./");
  if (!rootFolders.includes("flicker-config.json"))
    throw new Error(
      loggerMessage.error(
        "Unable to find FlickerUI's config.\n Make sure to initialize FlickerUI with 'flicker-ui init' before using the CLI for anything"
      )
    );

  try {
    const config = readFileSync("./flicker-config.json", "utf8");
    const configObject = JSON.parse(config);

    return configObject;
  } catch (e) {
    logger.error(`Unable to read FlickerUI config file.\n Error: ${JSON.stringify(e)}`);
  }
}

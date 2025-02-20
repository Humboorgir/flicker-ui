import prompts from "prompts";
import logger, { loggerMessage } from "./logger";
import saveConfig from "./saveConfig";

export default async function askForPreferredPackageManager() {
  const { selectedOption } = await prompts({
    type: "select",
    name: "selectedOption",
    message: loggerMessage.alert(`What is your preferred package manager?`, { raw: true }),
    choices: [
      { title: "NPM", value: "npm" },
      { title: "Yarn", value: "yarn" },
      { title: "PNPM", value: "pnpm" },
      { title: "Bun", value: "bun" },
    ],
  });

  if (!selectedOption) {
    logger.error("No option was specified");
    process.exit();
  }
  saveConfig({ preferredPackageManager: selectedOption });
  logger.success(`Set ${selectedOption} as your preferred package manager.`);
}

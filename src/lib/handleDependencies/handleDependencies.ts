import logger, { loggerMessage } from "../logger";
import prompts from "prompts";
import ora from "ora";

import parseComponentDependencies from "./parseDependencies";
import checkInstalledNPMPackages from "./checkInstalledNPMPackages";
import installNPMPackages from "./installNPMPackages";
import chalk from "chalk";

export default async function handleDependencies(name: string, type: "component" | "hook") {
  const { npmDependencies, hookDependencies, utilDependencies, componentDependencies } =
    parseComponentDependencies(name, type);

  const installedModules = checkInstalledNPMPackages(npmDependencies);

  const notInstalledModules = npmDependencies.filter((npmDep) => !installedModules.includes(npmDep));

  if (installedModules.length)
    logger.success(
      `The following dependencies are already installed:
${chalk.underline(installedModules.join(", "))}
Skipping module installation.`,
      {
        raw: true,
      }
    );

  if (!notInstalledModules.length)
    return logger.success("All dependencies already installed!", { raw: true });

  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    message: loggerMessage.alert(
      `NPM dependencie(s) "${notInstalledModules.join(
        ", "
      )}" found to be used in the component. Install them?`
    ),
  });

  if (!confirm) return;

  const installingSpinner = ora(`Installing dependencies...\n`);
  installingSpinner.start();

  await installNPMPackages({ dependencies: notInstalledModules });

  installingSpinner.succeed(`Successfully installed npm dependencies: ${notInstalledModules.join(", ")}`);
}

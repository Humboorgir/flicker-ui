import logger, { loggerMessage } from "../logger";
import prompts from "prompts";
import ora from "ora";
import chalk from "chalk";

import parseComponentDependencies from "./parseDependencies";
import checkInstalledNPMPackages from "./checkInstalledNPMPackages";
import installNPMPackages from "./installNPMPackages";
import addHook from "../addCommand/addHook";
import addComponent from "../addCommand/addComponent";

export default async function handleDependencies(name: string, type: "component" | "hook") {
  const { npmDependencies, hookDependencies, utilDependencies, componentDependencies } =
    parseComponentDependencies(name, type);

  // --- handling component dependencies ---
  if (componentDependencies.length) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: loggerMessage.alert(
        `Component(s) "${chalk.underline(
          componentDependencies.join(", ")
        )}" found to be used in the component. Add them to the project?`
      ),
    });

    if (!confirm) return;

    componentDependencies.forEach(async (componentName) => {
      await addComponent(componentName);
    });
  }
  // --- handling hook dependencies ---
  if (hookDependencies.length) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: loggerMessage.alert(
        `Hook(s) "${chalk.underline(
          hookDependencies.join(", ")
        )}" found to be used in the component. Add them to the project?`
      ),
    });

    if (!confirm) return;

    hookDependencies.forEach(async (hookName) => {
      await addHook(hookName);
    });
  }
  // --- handling NPM dependencies ---
  const installedModules = checkInstalledNPMPackages(npmDependencies);

  const notInstalledModules = npmDependencies.filter((npmDep) => !installedModules.includes(npmDep));

  if (installedModules.length)
    logger.alert(
      `The following dependencies are already installed:
${chalk.underline(installedModules.join(", "))}
${chalk.green("Skipping module installation.")}`
    );

  if (!notInstalledModules.length)
    return logger.success("All dependencies already installed!", { raw: true });

  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    message: loggerMessage.alert(
      `NPM dependencie(s) "${notInstalledModules.join(", ")}" found to be used in the ${type}. Install them?`
    ),
  });

  if (!confirm) return;

  const installingSpinner = ora(`Installing dependencies...\n`);
  installingSpinner.start();

  await installNPMPackages({ dependencies: notInstalledModules });

  installingSpinner.succeed(
    `Successfully installed npm dependencies: ${chalk.underline(notInstalledModules.join(", "))}`
  );
}

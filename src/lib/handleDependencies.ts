import path from "path";
import * as fs from "fs";
import { parseComponentDependencies } from "./parseComponentDependencies";
import logger, { loggerMessage } from "./logger";
import prompts from "prompts";

export default function handleDependencies(componentName: string) {
  const source = path.join(__dirname, "..", "components", componentName.toLowerCase());

  const componentDirectories = fs.readdirSync(source);

  type Dependencies = {
    dependencies: string[];
    hookDependencies: string[];
    utilDependencies: string[];
    componentDependencies: string[];
  };

  const totalDependencies: Dependencies = {
    dependencies: [],
    hookDependencies: [],
    utilDependencies: [],
    componentDependencies: [],
  };

  componentDirectories.forEach((componentDir) => {
    const componentPath = `${source}/${componentDir}`;
    const code = fs.readFileSync(componentPath, { encoding: "utf-8" });

    const dependencies = parseComponentDependencies(code);

    const dependencyTypes = Object.keys(dependencies) as (keyof typeof totalDependencies)[];
    dependencyTypes.forEach((dependencyType) => {
      totalDependencies[dependencyType].push(...dependencies[dependencyType]);
    });
  });

  const totalDependencyTypes = Object.keys(totalDependencies) as (keyof typeof totalDependencies)[];

  const installedModules = checkInstalledModules(totalDependencies.dependencies);

  totalDependencyTypes.forEach((dependencyType) => {
    if (dependencyType != "dependencies") return;

    totalDependencies[dependencyType].forEach(async (dependency) => {
      if (installedModules.includes(dependency))
        return logger.alert(`${dependency} is already installed, skipping module installation.`);

      const { confirm } = await prompts({
        type: "confirm",
        name: "confirm",
        message: loggerMessage.alert(
          `NPM module ${dependency} is required for the component to function properly. Install it?`
        ),
      });

      if (confirm) logger.alert("Installing...");
    });
  });
}

export function checkInstalledModules(moduleNames: string[]): string[] {
  // 1. Find project root (where package.json resides)
  let currentDir = process.cwd();
  let packageJsonPath: string;

  do {
    packageJsonPath = path.join(currentDir, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      // 2. Found project root
      const nodeModulesPath = path.join(currentDir, "node_modules");

      // 3. Check if node_modules exists
      if (!fs.existsSync(nodeModulesPath)) return [];

      // 4. Check each module
      return moduleNames.filter((module) => {
        const modulePath = path.join(nodeModulesPath, ...module.split("/"));
        try {
          // Check if directory exists and is actually a directory
          return fs.statSync(modulePath).isDirectory();
        } catch (e) {
          return false;
        }
      });
    }

    currentDir = path.dirname(currentDir);
  } while (currentDir !== path.parse(currentDir).root);

  throw new Error("No package.json found in directory hierarchy");
}

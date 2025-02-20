import { existsSync, statSync } from "node:fs";
import path from "node:path";

export default function checkInstalledNPMPackages(packageNames: string[]): string[] {
  // 1. Find project root (where package.json resides)
  let currentDir = process.cwd();
  let packageJsonPath: string;

  do {
    packageJsonPath = path.join(currentDir, "package.json");

    if (existsSync(packageJsonPath)) {
      // 2. Found project root
      const nodeModulesPath = path.join(currentDir, "node_modules");

      // 3. Check if node_modules exists
      if (!existsSync(nodeModulesPath)) return [];

      // 4. Check each module
      return packageNames.filter((module) => {
        const modulePath = path.join(nodeModulesPath, ...module.split("/"));
        try {
          // Check if directory exists and is actually a directory
          return statSync(modulePath).isDirectory();
        } catch (e) {
          return false;
        }
      });
    }

    currentDir = path.dirname(currentDir);
  } while (currentDir !== path.parse(currentDir).root);

  throw new Error("No package.json found in directory hierarchy");
}

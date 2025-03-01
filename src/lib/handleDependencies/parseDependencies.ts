import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import getDirname from "../getDirname";
import parseCodeDependencies from "./parseCodeDependencies";

// uses 'parseDependencies' to get every dependency used in a component (which can have multiple files).
export default function parseDependencies(componentName: string, type: "component" | "hook") {
  const __dirname = getDirname();

  let sourceFolder;
  if (type == "hook") sourceFolder = "hooks";
  else sourceFolder = "components";

  const source = path.join(__dirname, "..", sourceFolder, componentName);
  const stats = statSync(source);

  if (stats.isFile()) {
    const code = readFileSync(source, { encoding: "utf-8" });
    return parseCodeDependencies(code);
  }

  const componentDirectories = readdirSync(source);

  type Dependencies = {
    npmDependencies: Set<string>;
    hookDependencies: Set<string>;
    utilDependencies: Set<string>;
    componentDependencies: Set<string>;
  };

  //   Using sets because they automatically handle de-duplication
  const totalDependencies: Dependencies = {
    npmDependencies: new Set(),
    hookDependencies: new Set(),
    utilDependencies: new Set(),
    componentDependencies: new Set(),
  };

  componentDirectories.forEach((componentDir) => {
    const componentPath = `${source}/${componentDir}`;
    const code = readFileSync(componentPath, { encoding: "utf-8" });

    const dependencies = parseCodeDependencies(code);

    const dependencyTypes = Object.keys(dependencies) as (keyof typeof totalDependencies)[];
    dependencyTypes.forEach((dependencyType) => {
      dependencies[dependencyType].forEach((dependency) => totalDependencies[dependencyType].add(dependency));
    });
  });

  // De-duplicate dependencies

  return {
    npmDependencies: Array.from(totalDependencies.npmDependencies),
    hookDependencies: Array.from(totalDependencies.hookDependencies),
    utilDependencies: Array.from(totalDependencies.utilDependencies),
    componentDependencies: Array.from(totalDependencies.componentDependencies),
  };
}

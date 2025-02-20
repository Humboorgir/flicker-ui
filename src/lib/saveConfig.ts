import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import logger from "./logger";

type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

// Atleast one of the following properties HAVE to be specified.
// Running the function with an empty config object would be pointless.
export type Config = RequireAtLeastOne<{
  componentsFolderPath: string;
  preferredPackageManager: "npm" | "bun" | "yarn" | "pnpm";
}>;

function saveConfig(specifiedConfig: Config) {
  const { componentsFolderPath, preferredPackageManager } = specifiedConfig;
  if (!componentsFolderPath && !preferredPackageManager) return;

  const userDirectories = readdirSync("./");

  // If config already exists, we will merge the old config with the new one
  const configAlreadyExists = userDirectories.includes("flicker-config.json");

  const currentConfig = configAlreadyExists
    ? JSON.parse(readFileSync("flicker-config.json", { encoding: "utf-8" }))
    : null;

  const configToBeSaved = currentConfig ? { ...currentConfig, ...specifiedConfig } : specifiedConfig;

  const configToBeSavedString = JSON.stringify(configToBeSaved);

  try {
    writeFileSync("flicker-config.json", configToBeSavedString, "utf8");

    return { ok: true };
  } catch (err) {
    logger.error(`Something went wrong whilst attempting to save config!\n Error: ${JSON.stringify(err)}`);
    return { ok: false };
  }
}

export default saveConfig;

import { execa } from "execa";
import askForPreferredPackageManager from "../initCommand/askForPreferredPackageManager";
import getConfig from "../getConfig";

type InstallNPMPackagesArgs = {
  dependencies: string[];
};

export default async function installNPMPackages({ dependencies }: InstallNPMPackagesArgs) {
  const { preferredPackageManager } = getConfig();

  if (!preferredPackageManager) await askForPreferredPackageManager();

  const { stdout } = await execa(
    preferredPackageManager,
    [preferredPackageManager == "npm" ? "install" : "add", ...dependencies],
    {
      reject: false,
      cwd: process.cwd(),
    }
  );

  console.log(stdout);
}

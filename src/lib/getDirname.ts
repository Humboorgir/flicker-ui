import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export default function getDirname() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  return __dirname;
}

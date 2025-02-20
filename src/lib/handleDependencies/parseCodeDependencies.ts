// Parses the list of dependencies used in a given string of code
export default function parseCodeDependencies(code: string): {
  npmDependencies: string[];
  hookDependencies: string[];
  utilDependencies: string[];
  componentDependencies: string[];
} {
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/gm;
  const imports: string[] = [];
  let match: RegExpExecArray | null;

  // Using sets to handle duplications
  const npmDependencies = new Set<string>();
  const hookDependencies = new Set<string>();
  const utilDependencies = new Set<string>();
  const componentDependencies = new Set<string>();

  // Extract all import sources
  while ((match = importRegex.exec(code)) !== null) {
    if (match[1]) imports.push(match[1]);
  }

  const getNpmPackageName = (source: string): string => {
    const parts = source.split("/");
    if (source.startsWith("@") && parts.length > 1) {
      return `${parts[0]}/${parts[1]}`;
    }
    return parts[0] as string;
  };

  const isLocalPath = (source: string): boolean => {
    return source.startsWith("./") || source.startsWith("../") || source.startsWith("@/");
  };

  const getFilename = (source: string): string => {
    const parts = source.split("/");
    const lastPart = parts[parts.length - 1] as string;
    return lastPart.replace(/\..+$/, "");
  };

  for (const source of imports) {
    if (source.startsWith("@/hooks/")) {
      hookDependencies.add(getFilename(source));
    } else if (source.startsWith("@/components/ui/")) {
      componentDependencies.add(getFilename(source));
    } else if (source.startsWith("@/lib/")) {
      utilDependencies.add(getFilename(source));
    } else if (isLocalPath(source)) {
      // Ignore other local imports
    } else {
      npmDependencies.add(getNpmPackageName(source));
    }
  }

  return {
    npmDependencies: Array.from(npmDependencies),
    hookDependencies: Array.from(hookDependencies),
    utilDependencies: Array.from(utilDependencies),
    componentDependencies: Array.from(componentDependencies),
  };
}

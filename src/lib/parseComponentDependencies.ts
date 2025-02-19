export function parseComponentDependencies(code: string): {
  dependencies: string[];
  hookDependencies: string[];
  utilDependencies: string[];
  componentDependencies: string[];
} {
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/gm;
  const imports: string[] = [];
  let match: RegExpExecArray | null;

  // Using sets to handle duplications
  const dependencies = new Set<string>();
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
      dependencies.add(getNpmPackageName(source));
    }
  }

  return {
    dependencies: Array.from(dependencies),
    hookDependencies: Array.from(hookDependencies),
    utilDependencies: Array.from(utilDependencies),
    componentDependencies: Array.from(componentDependencies),
  };
}

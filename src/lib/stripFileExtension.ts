export default function stripFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");

  //   Where:
  // - No extension found (index === -1)
  // - Hidden file (index === 0)
  if (lastDotIndex <= 0) return filename;

  return filename.slice(0, lastDotIndex);
}

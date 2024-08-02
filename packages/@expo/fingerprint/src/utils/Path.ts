import minimatch, { type IMinimatch } from 'minimatch';

/**
 * Indicate the given `filePath` should be excluded by the `ignorePaths`.
 */
export function isIgnoredPath(
  filePath: string,
  ignorePaths: string[],
  minimatchOptions: minimatch.IOptions = { dot: true }
): boolean {
  const matchObjects = buildPathMatchObjects(ignorePaths, minimatchOptions);
  return isIgnoredPathWithMatchObjects(filePath, matchObjects);
}

/**
 * Prebuild match objects for `isIgnoredPathWithMatchObjects` calls.
 */
export function buildPathMatchObjects(
  paths: string[],
  minimatchOptions: minimatch.IOptions = { dot: true }
): IMinimatch[] {
  return paths.map((filePath) => new minimatch.Minimatch(filePath, minimatchOptions));
}

/**
 * Indicate the given `filePath` should be excluded by the prebuilt `matchObjects`.
 */
export function isIgnoredPathWithMatchObjects(
  filePath: string,
  matchObjects: IMinimatch[]
): boolean {
  let result = false;
  for (const minimatchObj of matchObjects) {
    const currMatch = minimatchObj.match(filePath);
    if (minimatchObj.negate && result && !currMatch) {
      // Special handler for negate (!pattern).
      // As long as previous match result is true and not matched from the current negate pattern, we should early return.
      return false;
    }
    result ||= currMatch;
  }
  return result;
}

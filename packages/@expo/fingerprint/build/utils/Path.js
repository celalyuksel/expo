"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIgnoredPathWithMatchObjects = exports.buildPathMatchObjects = exports.isIgnoredPath = void 0;
const minimatch_1 = __importDefault(require("minimatch"));
/**
 * Indicate the given `filePath` should be excluded by the `ignorePaths`.
 */
function isIgnoredPath(filePath, ignorePaths, minimatchOptions = { dot: true }) {
    const matchObjects = buildPathMatchObjects(ignorePaths, minimatchOptions);
    return isIgnoredPathWithMatchObjects(filePath, matchObjects);
}
exports.isIgnoredPath = isIgnoredPath;
/**
 * Prebuild match objects for `isIgnoredPathWithMatchObjects` calls.
 */
function buildPathMatchObjects(paths, minimatchOptions = { dot: true }) {
    return paths.map((filePath) => new minimatch_1.default.Minimatch(filePath, minimatchOptions));
}
exports.buildPathMatchObjects = buildPathMatchObjects;
/**
 * Indicate the given `filePath` should be excluded by the prebuilt `matchObjects`.
 */
function isIgnoredPathWithMatchObjects(filePath, matchObjects) {
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
exports.isIgnoredPathWithMatchObjects = isIgnoredPathWithMatchObjects;
//# sourceMappingURL=Path.js.map
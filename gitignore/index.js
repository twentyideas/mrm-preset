"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Mrm module to work with new line separated text files
const mrm_core_1 = require("mrm-core");
module.exports = function task() {
    // Read .gitignore if it exists
    (0, mrm_core_1.lines)(".gitignore")
        // Add lines that do not exist in a file yet,
        // but keep all existing lines
        .add([
        "node_modules/",
        ".DS_Store",
        ".vscode/",
        ".idea/",
        "# yarn berry: https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored",
        ".yarn/*",
        "!.yarn/patches",
        "!.yarn/plugins",
        "!.yarn/releases",
        "!.yarn/sdks",
        "!.yarn/versions",
        ".pnp.* # Comment out for zero install support",
        ".yarn/cache # Replace with !.yarn/cache for zero install support",
        "",
    ])
        // Update or create a file
        .save();
};

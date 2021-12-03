"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs");
const mrm_core_1 = require("mrm-core");
// copied from mrm-core/src/npm.js
/*
 * Is project using Yarn?
 */
function isUsingYarn() {
    return fs.existsSync("yarn.lock");
}
/*
 * Is project using Yarn@berry?
 */
function isUsingYarnBerry() {
    return isUsingYarn() && fs.existsSync(".yarnrc.yml");
}
const huskyPreCommit = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
# if nvm is installed, use it

if [ -n "$(command -v nvm)" ]; then
  nvm use
else 
  echo >&2 "nvm is recommended, but it's not installed. Consider installing: https://github.com/nvm-sh/nvm - Using system node version"
fi
`;
module.exports = function task() {
    (0, mrm_core_1.copyFiles)(".", ".lintstagedrc.js");
    if (isUsingYarnBerry()) {
        (0, child_process_1.execSync)("yarn dlx husky-init --yarn2");
        const pkg = (0, mrm_core_1.packageJson)();
        // currently the husky install isn't working, so this shims in the correct commands
        const prepublishCmd = pkg.getScript("prepublishOnly");
        if (prepublishCmd) {
            console.log("what");
            pkg.removeScript("prepublishOnly");
            const prepackCmd = pkg.getScript("prepack");
            console.log(prepackCmd);
            console.log(prepublishCmd);
            console.log(!prepackCmd.includes(prepublishCmd));
            if (!prepackCmd) {
                pkg.setScript("prepack", prepublishCmd);
            }
            else if (prepackCmd && !prepackCmd.includes(prepublishCmd)) {
                pkg.prependScript("prepack", prepublishCmd);
            }
        }
        const postpublishCmd = pkg.getScript("postpublish");
        if (postpublishCmd) {
            pkg.removeScript("postpublish");
            pkg.setScript("postpack", postpublishCmd);
        }
        pkg.save();
        (0, mrm_core_1.lines)("./.husky/pre-commit")
            .set([huskyPreCommit])
            .add("yarn run precommit")
            .save();
    }
    else {
        (0, child_process_1.execSync)("npx husky-init");
        (0, mrm_core_1.lines)("./.husky/pre-commit")
            .set([huskyPreCommit])
            .add("npm run precommit")
            .save();
    }
    (0, mrm_core_1.packageJson)().appendScript("precommit", "npx lint-staged").save();
    (0, mrm_core_1.install)(["lint-staged", "husky"]);
};

import { execSync } from "child_process"
import * as fs from "fs"
import { copyFiles, install, lines, packageJson } from "mrm-core"

// copied from mrm-core/src/npm.js
/*
 * Is project using Yarn?
 */
function isUsingYarn() {
	return fs.existsSync("yarn.lock")
}

/*
 * Is project using Yarn@berry?
 */
function isUsingYarnBerry() {
	return isUsingYarn() && fs.existsSync(".yarnrc.yml")
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
`

module.exports = function task() {
	copyFiles(".", ".lintstagedrc.js")
	if (isUsingYarnBerry()) {
		execSync("yarn dlx husky-init --yarn2")
		lines("./.husky/pre-commit")
			.set([huskyPreCommit])
			.add("yarn run precommit")
			.save()
	} else {
		execSync("npx husky-init")
		lines("./.husky/pre-commit")
			.set([huskyPreCommit])
			.add("npm run precommit")
			.save()
	}
	packageJson().appendScript("precommit", "npx lint-staged").save()
	install(["lint-staged", "husky"])
}

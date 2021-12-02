import { lines } from "mrm-core"

module.exports = function task() {
	lines(".nvmrc")
		// Add lines that do not exist in a file yet,
		// but keep all existing lines
		.add(["16"])
		// Update or create a file
		.save()
}

module.exports.description = "Add lines to .nvmrc"

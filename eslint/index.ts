import { copyFiles, install, json, lines, packageJson } from "mrm-core"

module.exports = function eslint() {
	const packages = {
		"@20i/eslint-config": "^2.0.2",
		eslint: "^8.10.0",
		prettier: "^2.5.1",
		typescript: "^4.6.2",
	}
	let baseExtends = "@20i/eslint-config"
	const hasReact = json("package.json").get("dependencies.react") as boolean
	const hasReactNative = json("package.json").get(
		"dependencies.react-native"
	) as boolean
	if (hasReactNative) {
		baseExtends = "@20i/eslint-config/react-native"
	} else if (hasReact) {
		baseExtends = "@20i/eslint-config/react"
	}
	const eslintrc = json(".eslintrc", {})
	eslintrc
		.merge({
			extends: [baseExtends],
			parserOptions: {
				project: ["./tsconfig.eslint.json"],
			},
			ignorePatterns: [],
		})
		.save()

	// tsconfig.eslint.json
	// extend your base config to share compilerOptions, etc
	json("tsconfig.eslint.json", {})
		.set({
			extends: "./tsconfig.json",
			compilerOptions: {
				noEmit: true,
			},
			include: ["**/*", "**/.*"],
		})
		.save()

	// package.json
	packageJson()
		.setScript(
			"lint",
			'yarn eslint --max-warnings=0 --cache --fix "**/*.{js,ts,jsx,tsx}"'
		)
		.save()

	// add .eslintcache to gitignore
	const gitignore = lines(".gitignore")
	gitignore.add(["", ".eslintcache"]).save()

	// Install dependencies
	install(packages)

	// copy .prettierrc from @20i/eslint-config
	console.log("Copying .prettierrc from @20i/eslint-config")
	copyFiles("./node_modules/@20i/eslint-config/", ".prettierrc")
}

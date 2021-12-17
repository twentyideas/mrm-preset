import { lines, markdown, PackageJson, packageJson, yaml } from "mrm-core"
import packageRepoUrl from "package-repo-url"
import { parseRange } from "semver-utils"

module.exports = function task() {
	lines(".nvmrc")
		// Add lines that do not exist in a file yet,
		// but keep all existing lines
		.add(["16"])
		// Update or create a file
		.save()
}

function getNodeVersion(pkg: PackageJson) {
	const nvmrc = lines(".nvmrc").get()[0]
	// Minimum supported version
	const minNodeVersionRaw = pkg.get("engines.node") as string | undefined
	const minNodeVersion = minNodeVersionRaw
		? parseRange(minNodeVersionRaw)[0].major
		: parseRange(nvmrc)[0].major ?? 16

	// Range of LTS versions from min to current LTS
	return minNodeVersion
}

module.exports = function task({
	workflowFile,
	readmeFile,
}: {
	workflowFile: string
	readmeFile: string
}) {
	const nodeVersion = getNodeVersion(packageJson())

	// Workflow file
	yaml(workflowFile, {})
		// @ts-expect-error Doing the same thing as in the docs... bad types i guess?
		.set({
			name: "Publish to npm",
			on: {
				release: {
					types: ["created"],
				},
			},
			jobs: {
				Publish: {
					"runs-on": "ubuntu-latest",
					steps: [
						{
							uses: "actions/checkout@v2",
						},
						{
							uses: "actions/setup-node@v2.4.1",
							with: {
								"node-version": nodeVersion,
								"registry-url": "https://registry.npmjs.org",
								scope: "@20i",
								cache: "yarn",
								"cache-dependency-path": "yarn.lock",
							},
						},
						{
							run: "yarn",
						},
						{
							run: "npm publish",
							env: {
								NODE_AUTH_TOKEN: "${{ secrets.NPM_TOKEN }}",
							},
						},
					],
				},
			},
		})
		.save()

	// Release notes template
	yaml(".github/release.yml", {})
		// @ts-expect-error Doing the same thing as in the docs... bad types i guess?
		.set({
			changelog: {
				categories: [
					{
						title: "Breaking Changes 🛠️",
						labels: ["Semver-Major", "breaking-change"],
					},
					{
						title: "Exciting New Features 🎉",
						labels: ["Semver-Minor", "enhancement"],
					},
					{ title: "Other Changes", labels: ["*"] },
				],
			},
		})
		.save()

	const readme = markdown(readmeFile)
	if (readme.exists()) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const github = packageRepoUrl()

		readme
			// Add status badge to Readme
			.addBadge(
				`${github}/actions/workflows/${workflowFile}/badge.svg`,
				`${github}/actions`,
				"NPM Publish status"
			)
			.save()
		lines(readmeFile)
			.add([
				"\n",
				"## Publish CI\n",
				"This package is published to npm using the [Publish CI](",
				`${github}/${workflowFile}) workflow.\n`,
				"The workflow is configured to publish the package to npm after a successful release and package.json version bump.\n",
				"To use,",
				"1. Add a publish `NPM_TOKEN` to your github repo secrets",
				"2. Bump the package.json version",
				"3. Make a release\n",
				"> For effective changelogs, be sure to add the labels found in [release.yml](./.github/release.yml) to PRs.\n",
			])
			.save()
	}
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.description = "Adds GitHub Actions workflow to run Publish CI"
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.parameters = {
	workflowFile: {
		type: "input",
		message: "Enter location of GitHub Actions workflow file",
		default: ".github/workflows/publish.yml",
	},
	readmeFile: {
		type: "input",
		message: "Enter filename for the readme",
		default: "Readme.md",
	},
}

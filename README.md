# mrm-preset

mrm preset to set up nvm, eslint, prettier, lint-staged, husky, and typescript

## Usage

Setup all the things!

```bash
npx mrm all --preset @20i/mrm-preset
# or for yarn berry
yarn dlx mrm all --preset @20i/mrm-preset
```

## Details

> Each of these can be set up individually.
> To see all available tasks, run `npx mrm --preset @20i/mrm-preset`

### nvm

```bash
npx mrm nvm --preset @20i/mrm-preset
```

Every project should have a `.nvmrc` file. Currently this defaults to 16, but you can change it to whatever you need.

> nvm can be installed by following their [installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating)

### eslint

```bash
npx mrm eslint --preset @20i/mrm-preset
```

The [@20i/eslint-config](https://www.npmjs.com/package/@20i/eslint-config) will be installed with prettier and typescript support by default. See the package for more details.

> If React or React Native are found as dependencies, additional eslint packages will be installed. This command can be run again after adding react if needed.

### lint-staged

```bash
npx mrm lint-staged --preset @20i/mrm-preset
```

This also sets up husky to run as a pre-commit hook. The default command is to use a `precommit` npm script, but that can be adjusted in `.husky/pre-commit` and in your `package.json`.

### .gitignore

```bash
npx mrm gitignore --preset @20i/mrm-preset
```

Configured with default values for a node project and yarn berry.

### Default mrm presets

> Any default preset can be run with `npx mrm <PRESET>`

#### [typescript](https://www.npmjs.com/package/@20i/mrm-preset-typescript)

Currently, this just runs the [mrm preset for typescript](https://github.com/sapegin/mrm/tree/master/packages/mrm-task-typescript). PRs are welcome to update this :D

#### [readme](https://github.com/sapegin/mrm/tree/master/packages/mrm-task-readme)

Will only run if a readme is not already present.

#### [license](https://github.com/sapegin/mrm/tree/master/packages/mrm-task-license)

Will only run if a license is not already present.

#### [editorconfig](https://github.com/sapegin/mrm/tree/master/packages/mrm-task-editorconfig)

This is a nifty config to help your editor have better default values. For more options, check out [editorconfig docs](https://editorconfig.org/).

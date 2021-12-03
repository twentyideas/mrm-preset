"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mrm_core_1 = require("mrm-core");
module.exports = function () {
    const packages = [
        "eslint",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "eslint-config-prettier",
        "eslint-plugin-prettier",
        "prettier",
        "@20i/eslint-config",
    ];
    let baseExtends = "@20i/eslint-config";
    const hasReact = (0, mrm_core_1.json)("package.json").get("dependencies.react");
    const hasReactNative = (0, mrm_core_1.json)("package.json").get("dependencies.react-native");
    if (hasReactNative) {
        // TODO: add react-native
        console.warn("React native not setup yet");
    }
    else if (hasReact) {
        console.warn("Found react, adding eslint react rules");
        packages.push("eslint-plugin-react", "eslint-plugin-react-hooks", "eslint-plugin-jsx-a11y", "eslint-plugin-import", 
        // TODO replace dependency on react-app
        "eslint-config-react-app", "eslint-plugin-flowtype");
        baseExtends = "@20i/eslint-config/react";
    }
    const eslintrc = (0, mrm_core_1.json)(".eslintrc", {});
    eslintrc
        .merge({
        extends: [baseExtends],
        parserOptions: {
            project: ["./tsconfig.eslint.json"],
        },
        ignorePatterns: [],
    })
        .save();
    // tsconfig.eslint.json
    // extend your base config to share compilerOptions, etc
    (0, mrm_core_1.json)("tsconfig.eslint.json", {})
        .set({
        extends: "./tsconfig.json",
        compilerOptions: {
            noEmit: true,
        },
        include: ["**/*", "**/.*"],
    })
        .save();
    // package.json
    (0, mrm_core_1.packageJson)()
        .setScript("lint", 'yarn eslint --max-warnings=0 --cache --fix "**/*.{js,ts,jsx,tsx}"')
        .save();
    // add .eslintcache to gitignore
    const gitignore = (0, mrm_core_1.lines)(".gitignore");
    gitignore.add(["", ".eslintcache"]).save();
    // Install dependencies
    (0, mrm_core_1.install)(packages);
};

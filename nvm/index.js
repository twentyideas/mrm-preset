"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mrm_core_1 = require("mrm-core");
module.exports = function task() {
    (0, mrm_core_1.lines)(".nvmrc")
        // Add lines that do not exist in a file yet,
        // but keep all existing lines
        .add(["16"])
        // Update or create a file
        .save();
};
module.exports.description = "Add lines to .nvmrc";

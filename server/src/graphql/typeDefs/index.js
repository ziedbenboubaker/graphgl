const { readFileSync } = require("fs");

module.exports = readFileSync(`${__dirname}/schema.graphqls`, "utf8");

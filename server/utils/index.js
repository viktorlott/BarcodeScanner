const chalk = require("chalk")

module.exports.serverlog = (mod) => console.log(`${chalk.magenta("[*]")}   |__ Loading ${chalk.underline.red("%s")}`, mod)
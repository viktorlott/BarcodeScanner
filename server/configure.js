const chalk = require("chalk")

module.exports = app => ({
	start(http) {
		http.listen(process.env.SERVER_PORT)
		console.log(`${chalk.magenta("[*]")} Server online on port ${chalk.underline.red("%s")}`, process.env.SERVER_PORT)
	},
	with(...fns) {
		fns.reduce(async (before, fn) => {
			before && await before
			return await Promise.resolve(fn(app))
		}, undefined)

		return this
	}
})

const path = require("path")

const appPath = path.resolve(__dirname, "src", "index.js")
const contentPath = path.resolve(__dirname, "src", "content.js")
const extensionPath = path.resolve(__dirname, "src", "extension.js")

const filename = "static/js/index.js" // old .[contenthash:8].js

module.exports = function override(config, env) {
	if(env === "production") {
		// config.entry = {
		// 	index: appPath,
		// 	// content: contentPath
		// }
		// config.entry.push(appPath)
		// config.entry.push(contentPath)
		// config.entry.push(extensionPath)

		config.output.filename = filename
	}

	return config;
  }
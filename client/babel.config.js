// NOTE: This is a configuration file for tests to run properly. DO NOT TOUCH.
module.exports = {
	presets: [
		["@babel/preset-env", { targets: { node: "current" } }],
		"@babel/preset-typescript",
	],
	plugins: ["@babel/plugin-syntax-typescript"],
};

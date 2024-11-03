import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest/presets/js-with-ts-esm",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	transform: {
		"^.+\\.tsx?$": ["ts-jest", { useESM: true }],
	},
	extensionsToTreatAsEsm: [".ts", ".tsx"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/app/layout.tsx",
		"!src/app/page.tsx",
		"!src/**/index.ts",
		"!src/**/test/**", // Exclude test files if they are in a specific folder
	],
};

export default config;

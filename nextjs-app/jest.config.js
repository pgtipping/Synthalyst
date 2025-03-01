module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/src/lib/test/setup-prisma-mock.js",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": [
      "babel-jest",
      { configFile: "./.babelrc.test.js" },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!lucide-react|@radix-ui|@hookform|class-variance-authority|clsx|tailwind-merge|next-auth|jose|openid-client|@panva|uuid|preact)",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/.babelrc.test.js",
  ],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  verbose: true,
  testTimeout: 30000,
};

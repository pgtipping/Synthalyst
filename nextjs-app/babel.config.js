module.exports = {
  presets: [["next/babel"]],
  plugins: ["@babel/plugin-syntax-import-attributes"],
  // Increase the size limit for files that Babel will optimize
  generatorOpts: {
    maxSize: 2000000, // 2MB
  },
};

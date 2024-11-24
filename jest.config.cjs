module.exports = {
  transform: {
    '^.+\\.mjs$': 'babel-jest',  // Transformer les fichiers .mjs avec babel-jest
    '^.+\\.vue$': 'vue-jest',    // Transformer les fichiers .vue avec vue-jest
  },
  testMatch: [
    "**/__tests__/**/*.mjs",  // Rechercher les fichiers de test .mjs
    "**/?(*.)+(spec|test).mjs"
  ],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node', 'vue'],
  testEnvironment: 'jest-environment-jsdom'
};
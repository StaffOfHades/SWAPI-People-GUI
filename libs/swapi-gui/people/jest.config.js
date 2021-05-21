module.exports = {
  displayName: 'swapi-gui-people',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/swapi-gui/people',
  setupFilesAfterEnv: ['./src/lib/setupTests.ts'],
};

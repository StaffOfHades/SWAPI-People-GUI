const path = require('path');

const rootMain = require('../../../../.storybook/main');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(
  ...['../src/lib/**/*.stories.mdx', '../src/lib/**/*.stories.@(js|jsx|ts|tsx)']
);

rootMain.webpackFinal = async (config) => {
  // add SCSS support for CSS Modules
  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader?modules&importLoaders', 'sass-loader'],
    include: path.resolve(__dirname, '../src/lib/'),
  });

  return config;
};

module.exports = rootMain;

const { composePlugins, withNx } = require('@nx/webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = composePlugins(withNx(), (config) => {
  return {
    ...config,
    target: 'node',
    resolve: {
      ...config.resolve,
      extensions: ['.js', '.ts'],
      mainFields: ['module', 'main'],
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
          exclude: /node_modules/,
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    externals: [nodeExternals()],
    experiments: {
      topLevelAwait: true,
    },
  };
});

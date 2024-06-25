const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add a fallback for the 'crypto' and 'stream' modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    https: require.resolve('https-browserify'),
    http: require.resolve('stream-http'),  
  
  };
  return config;
};
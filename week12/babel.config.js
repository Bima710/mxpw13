module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-modules-commonjs', // Ensures ES modules are transpiled correctly
      ],
    };
  };
  
module.exports = function override(config, env) {
    // 添加 polyfill 配置
    config.resolve.fallback = {
      console: require.resolve('console-browserify'),
    };
    return config;
  };
  
  
// need to compile node_modules (eg: vue-runtime-helps)
module.exports = (api) => {
  api.cache(false);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
    ],
    plugins: ['@vue/babel-plugin-jsx', '@babel/plugin-transform-object-assign'],
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current',
              },
            },
          ],
        ],
        plugins: ['@vue/babel-plugin-jsx'],
      },
    },
  };
};

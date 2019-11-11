module.exports = api => {
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
    plugins: ['transform-vue-jsx', '@babel/plugin-transform-object-assign'],
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
        plugins: ['transform-vue-jsx'],
      },
    },
  };
};

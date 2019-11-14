/* eslint-disable import/no-extraneous-dependencies */
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const fs = require('fs');
const path = require('path');

const localePath = path.resolve(__dirname, 'src/locale');
const fileList = fs.readdirSync(localePath);

const plugins = [
  resolve({
    extensions: ['.js', '.json'],
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  commonjs(),
];

const umd = fileList.map(file => {
  const input = path.join(localePath, file);
  const external = ['vue2-datepicker'];
  const name = path.basename(file, '.js').replace(/-(\w+)/g, (m, p1) => p1.toUpperCase());
  return {
    input,
    plugins,
    external,
    output: {
      file: `locale/${file}`,
      format: 'umd',
      name: `DatePicker.lang.${name}`,
      globals: {
        'vue2-datepicker': 'DatePicker',
      },
    },
  };
});

const esm = fileList.map(file => {
  const input = path.join(localePath, file);
  const external = id => !id.startsWith('.') && !id.startsWith('/');
  return {
    input,
    plugins,
    external,
    output: {
      file: `locale/es/${file}`,
      format: 'esm',
      exports: 'named',
    },
  };
});

export default [...esm, ...umd];

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const external = Object.keys(pkg.dependencies);

const input = 'src/index.js';

const plugins = [
  resolve({
    extensions: ['.js', '.vue', '.jsx', '.json'],
  }),
  vue(),
  babel({
    runtimeHelpers: true,
    extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
  }),
  commonjs(),
];

const esm = {
  external,
  input,
  output: [
    {
      file: pkg.module,
      format: 'esm',
      exports: 'named',
    },
  ],
  plugins,
};

const umd = {
  input,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'DatePicker',
      sourcemap: true,
    },
    {
      file: pkg.main.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: 'DatePicker',
      sourcemap: true,
    },
  ],
  plugins: [
    ...plugins,
    terser({
      include: [/^.+\.min\.js$/],
      sourcemap: true,
      output: { comments: false },
      compress: {
        keep_infinity: true,
        pure_getters: true,
      },
      warnings: true,
      ecma: 5,
      toplevel: false,
    }),
  ],
};

export default [esm, umd];

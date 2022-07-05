import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { defineConfig } from 'rollup';
import { terser } from 'rollup-plugin-terser';

const isDev = !!process.env.ROLLUP_WATCH;

export default ['register', 'login'].map((filename) =>
  defineConfig({
    input: `./app/js/${filename}.js`,
    output: {
      file: `./public/assets/${filename}.js`,
      format: 'iife',
      sourcemap: isDev
    },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs({ sourceMap: false }),
      injectProcessEnv({
        NODE_ENV: isDev ? 'development' : 'production'
      }),
      postcss({
        minimize: !isDev,
        extract: true
      }),
      isDev && terser()
    ],
    watch: {
      include: ['app']
    }
  })
);

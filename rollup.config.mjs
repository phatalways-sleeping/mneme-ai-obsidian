import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const name = 'mneme-ai';

const developmentConfig = {
  input: 'src/plugin/main.ts',
  external: ['obsidian'],
  output: {
    dir: 'MnemeAI/.obsidian/plugins/mneme-ai',
    sourcemap: false,
    format: 'cjs',
    exports: 'default',
    name,
  },
  plugins: [
    json(),
    nodeResolve({ preferBuiltins: true }),
    cjs({ include: 'node_modules/**' }),
    typescript({ tsconfig: './tsconfig.dev.json' }),
    copy({
      targets: [
        {
          src: 'styles.css',
          dest: 'MnemeAI/.obsidian/plugins/mneme-ai/',
        },
        {
          src: 'manifest.json',
          dest: 'MnemeAI/.obsidian/plugins/mneme-ai/',
        },
      ],
    }),
  ],
};

const productionConfig = {
  input: 'src/plugin/main.ts',
  external: ['obsidian'],
  output: {
    dir: 'dist',
    sourcemap: false,
    sourcemapExcludeSources: true,
    format: 'cjs',
    exports: 'default',
    name,
  },
  plugins: [
    json(),
    nodeResolve({ preferBuiltins: true }),
    cjs({ include: 'node_modules/**' }),
    typescript({ tsconfig: './tsconfig.json' }),
    copy({
      targets: [
        {
          src: 'styles.css',
          dest: 'dist/',
        },
        {
          src: 'manifest.json',
          dest: 'dist/',
        },
      ],
    }),
    terser({ compress: true, mangle: true }),
  ],
};

const config =
  process.env.PRODUCTION === '1' ? productionConfig : developmentConfig;
export default config;

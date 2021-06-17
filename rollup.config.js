import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [
    typescript({objectHashIgnoreUnknownHack: true}),
    commonjs(),
    nodeResolve()
  ],
  external: [
    '@crud-studio/react-crud-core',
    '@emotion/react',
    '@emotion/styled',
    '@lottiefiles/react-lottie-player',
    '@material-ui/core',
    '@material-ui/icons',
    '@material-ui/lab',
    'lodash',
    'react',
    'react-dom',
    'react-dropzone',
    'react-hook-form',
    'react-intl',
    'react-router-dom',
    'react-use',
    'type-fest',
    'uuid',
    'xlsx'
  ]
}

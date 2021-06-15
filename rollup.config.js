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
  external: ['@crud-studio/react-crud-core', '@material-ui/core', '@material-ui/icons', 'lodash', 'react', 'react-dom', 'react-intl', 'react-router-dom', 'react-use', 'type-fest', 'uuid']
}

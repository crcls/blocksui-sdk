import { build } from 'esbuild'
import rimraf from 'rimraf'

import appConfig from './app.config.mjs'

appConfig.entryPoints = ['./src/*.ts']
appConfig.format = 'esm'

console.log('Cleaning www directory')
rimraf('www/*', (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  console.log('Building Module')
  build(appConfig)
    .then(() => {
      console.log('Done.')
    })
    .catch(() => process.exit(1))
})

import style from 'esbuild-style-plugin'
import inlineImage from 'esbuild-plugin-inline-image'
import dotenv from 'dotenv'

import postcssUrl from 'postcss-url'
import autoprefixer from 'autoprefixer'
import fs from 'fs'

dotenv.config()

const isProd = process.env.NODE_ENV === 'production'

export default {
  assetNames: 'images/[name]',
  chunkNames: '[name].[hash]',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  loader: {
    '.svg': 'file',
  },
  minify: isProd,
  outdir: 'www',
  plugins: [
    style({
      postcss: {
        plugins: [
          postcssUrl({
            assetsPath: './www/assets',
            encodeType: 'base64',
            fallback: (asset) => {
              const destDir = './www/assets'
              fs.mkdirSync(destDir, { recursive: true })

              const filename = asset.url.replace(/(\.\.\/)+assets\//, '')
              fs.copyFileSync(asset.absolutePath, `${destDir}/${filename}`)

              const filepath = asset.url.replace(/(\.\.\/)+/, '/')
              return (
                (isProd ? 'https://crcls.xyz' : 'http://localhost:3000') +
                filepath
              )
            },
            maxSize: 42,
            url: 'inline',
          }),
          autoprefixer(),
        ],
      },
    }),
    inlineImage({
      extensions: ['jpg', 'jpeg', 'png', 'gif'],
      limit: 43008,
    }),
  ],
  sourcemap: true,
  target: ['es2020', 'chrome98', 'edge98', 'firefox97', 'safari14.1'],
}

import { serve } from 'esbuild'
import rimraf from 'rimraf'
import http from 'http'
import fs from 'fs'

import appConfig from './app.config.mjs'
import html from './html.mjs'
import types from './types.mjs'

appConfig.entryPoints = ['./test/app.tsx']
appConfig.inject = ['./scripts/react-shim.mjs']
appConfig.format = 'iife'

const proxyServe = async (servedir, listen) => {
  const { host, port } = await serve({ servedir }, appConfig).catch((error) => {
    console.error(error)
    process.exit(1)
  })

  const proxy = http.createServer((req, res) => {
    const forwardRequest = (path) => {
      const options = {
        hostname: host,
        port,
        path,
        method: req.method,
        headers: req.headers,
      }

      const proxyReq = http.request(options, (proxyRes) => {
        if (proxyRes.statusCode === 404) {
          return forwardRequest('/')
        }

        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      })

      req.pipe(proxyReq, { end: true })
    }

    forwardRequest(req.url)
  })

  proxy.listen(listen)
}

rimraf('www/*', (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  types()
  html()

  proxyServe('./www', 3001).then(() => {
    fs.mkdirSync('./www/assets', { recursive: true })
  })
})

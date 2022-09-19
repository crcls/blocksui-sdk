import React, { ComponentType } from 'react'

import { base64EncArr, streamToArrayBuffer } from './utils/bytes'
import { resolver } from './utils/async'

// const ENDPOINT = 'http://localhost:8081'
const ENDPOINT = 'https://blocksui.io'

const cache: { [key: string]: Primitive } = {}

class Primitive {
  dataUrl: string = ''

  Component?: ComponentType
  options?: { [key: string]: any }

  private _url: string
  private _deps?: { [key: string]: any }

  constructor(url: string, deps: { [key: string]: any }) {
    this._url = url
    this._deps = deps
  }

  async load() {
    const [error, response] = await resolver<Response>(fetch(this._url))

    if (error || response === undefined || response.body == null) {
      throw error || new Error('Response was emtpy')
    }

    const data = await streamToArrayBuffer(response.body)
    const b64 = base64EncArr(data)
    this.dataUrl = `data:text/javascript;base64,${b64}`
    const mod = await import(/* webpackIgnore: true */ this.dataUrl)
    const component = await mod.default(React, this._deps)

    this.Component = component.default
    this.options = component.options
  }
}

export function loadPrimitive(
  name: string,
  deps: { [key: string]: any }
): Primitive {
  if (cache[name] !== undefined) {
    return cache[name]
  }

  const primitive = new Primitive(`${ENDPOINT}/primitives/${name}.js`, deps)
  primitive.load()
  cache[name] = primitive

  return primitive
}

export default Primitive

import { base64EncArr, streamToArrayBuffer } from './utils/bytes'
import { resolver } from './utils/async'

const ENDPOINT = 'https://blocksui.io'

const cache: { [key: string]: Primitive } = {}

class Primitive {
  dataUrl: string = ''

  constructor(data: Uint8Array) {
    const b64 = base64EncArr(data)
    this.dataUrl = `data:text/javascript;base64,${b64}`
  }

  render() {}
}

export async function loadPrimitive(name: string): Promise<Primitive> {
  if (cache[name] !== undefined) {
    return cache[name]
  }

  const [error, response] = await resolver<Response>(
    fetch(`${ENDPOINT}/primitives/${name}.js`)
  )

  if (error || response === undefined || response.body == null) {
    throw error || new Error('Response was emtpy')
  }

  const data = await streamToArrayBuffer(response.body)

  cache[name] = new Primitive(data)

  return cache[name]
}

export default Primitive

import mh from 'multihashes'

export function cidToBytes32(cid: string): string {
  const bytes = mh.fromB58String(cid)
  const hex = mh.toHexString(bytes.slice(2))

  return `0x${hex}`
}

export function bytes32ToCid(bytes32: string): string {
  const hex = '1220' + bytes32.substring(2)
  const bytes = mh.fromHexString(hex)
  return mh.toB58String(bytes)
}

/* Base64 string to array encoding */
export function uint6ToB64(nUint6: number) {
  return nUint6 < 26
    ? nUint6 + 65
    : nUint6 < 52
    ? nUint6 + 71
    : nUint6 < 62
    ? nUint6 - 4
    : nUint6 === 62
    ? 43
    : nUint6 === 63
    ? 47
    : 65
}

export function base64EncArr(aBytes: Uint8Array): string {
  let nMod3 = 2
  let sB64Enc = ''

  const nLen = aBytes.length
  let nUint24 = 0
  for (let nIdx = 0; nIdx < nLen; nIdx++) {
    nMod3 = nIdx % 3
    if (nIdx > 0 && ((nIdx * 4) / 3) % 76 === 0) {
      sB64Enc += '\r\n'
    }

    nUint24 |= aBytes[nIdx] << ((16 >>> nMod3) & 24)
    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
      sB64Enc += String.fromCodePoint(
        uint6ToB64((nUint24 >>> 18) & 63),
        uint6ToB64((nUint24 >>> 12) & 63),
        uint6ToB64((nUint24 >>> 6) & 63),
        uint6ToB64(nUint24 & 63)
      )
      nUint24 = 0
    }
  }

  return (
    sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) +
    (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==')
  )
}

export async function streamToArrayBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  let result = new Uint8Array(0)
  const reader = stream.getReader()
  while (true) {
    // eslint-disable-line no-constant-condition
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    const newResult = new Uint8Array(result.length + value.length)
    newResult.set(result)
    newResult.set(value, result.length)
    result = newResult
  }
  return result
}

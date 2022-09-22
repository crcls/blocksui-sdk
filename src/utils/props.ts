import { PropConfig } from '../types.js'

export function blockProp(value: any, cid?: string): PropConfig {
  return [cid || 'value', value]
}

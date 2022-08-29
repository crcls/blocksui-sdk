import { PropConfig } from '../types'

export function blockProp(value: any, cid?: string): PropConfig {
  return [cid || 'value', value]
}

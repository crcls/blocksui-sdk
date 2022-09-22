import { customAlphabet } from 'nanoid'

import {
  BlockConfig,
  ChildConfig
} from '../types.js'

export const createId = customAlphabet('1234567890abcdef', 10)

export function ensureIds(config: BlockConfig) {
  config.forEach((conf: ChildConfig) => {
    if (typeof conf === 'string') {
      return
    }

    if (conf.id === undefined) {
      conf.id = createId()
    }

    // recurse
    if (conf.children && conf.children.length > 0) {
      ensureIds(conf.children)
    }
  })
}

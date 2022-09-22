import { createContext } from 'react'

import { IBlockContext } from './types.js'

const BlockContext = createContext<IBlockContext|null>(null)

export default BlockContext

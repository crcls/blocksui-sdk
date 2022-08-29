import { createContext } from 'react'

import { IBlockContext } from './types'

const BlockContext = createContext<IBlockContext|null>(null)

export default BlockContext

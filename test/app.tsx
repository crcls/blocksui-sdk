import React from 'react'
import { createRoot } from 'react-dom/client'

import { BlockContainer } from '../src'

const config = [
  {
    children: ['Hi'],
    type: 'Paragraph',
  },
]

const App = () => {
  return <BlockContainer config={config} />
}

const root = createRoot(document.querySelector('#app'))
root.render(<App />)

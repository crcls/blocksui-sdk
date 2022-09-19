import React from 'react'
import { createRoot } from 'react-dom/client'

import { BlockContainer } from '../src'

const config = [
  {
    children: ['Hi'],
    type: 'Heading',
    props: {
      level: ['value', 2],
    },
  },
]

const App = () => {
  return <BlockContainer config={config} loadingComponent={<h1>LOAD</h1>} />
}

const root = createRoot(document.querySelector('#app'))
root.render(<App />)

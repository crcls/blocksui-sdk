import React from 'react'

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import BlockContainer from './BlockContainer'

import { PropConfig } from '../types'

const origLoc = global.location

describe('rendering', () => {
  beforeAll(() => {
    // @ts-ignore
    delete window.location

    // @ts-ignore
    window.location = {
      ...Object.getOwnPropertyDescriptors(origLoc),
      origin: '../../dist',
    }
  })

  afterAll(() => {
    global.location = origLoc
  })

  test('renders 1 leaf', async () => {
    const config = [
      {
        children: ['Click'],
        props: {
          href: ['value', 'http://example.com'] as PropConfig,
        },
        type: 'Link',
      },
    ]

    render(<BlockContainer config={config} />)

    const elem = await screen.findByRole('link')

    expect(elem.textContent).toHaveTextContent('Click')
    expect(elem).toHaveAttribute('href', 'http://example.com')
  })
})

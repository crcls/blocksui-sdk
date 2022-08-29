import { ensureIds } from './id'

import { ChildConfig } from '../types'

describe('ensureIds', () => {
  it('adds IDs to the configs that are missing one', () => {
    const config = [{
      children:[{
        children:[{ type: '' }],
        id: 'test',
        type: '',
      }],
      type: ''
    }]

    ensureIds(config)
    const result = (config[0] as ChildConfig)
    const children1 = (result.children![0] as ChildConfig)
    const children2 = (children1.children![0] as ChildConfig)

    expect(result).toHaveProperty('id')
    expect(children1.id).toBe('test')
    expect(children2).toHaveProperty('id')
  })
})

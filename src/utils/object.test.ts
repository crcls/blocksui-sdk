import { hasProp, isPojo } from './object'

describe('isPojo', () => {
  test('fails for non POJO', () => {
    expect(isPojo([])).toBe(false)
    expect(isPojo(Object.create({ prototype: {} }))).toBe(false)
    expect(isPojo(new class { constructor() {} })).toBe(false)
  })

  test('Succeeds with a POJO', () => {
    expect(isPojo({})).toBe(true)
  })
})

describe('hasProp', () => {
  test('returns success', () => {
    expect(hasProp({ name: 'name' }, 'name')).toBe(true)
  })

  test('returns false', () => {
    expect(hasProp({ name: 'name' }, 'type')).toBe(false)
    expect(hasProp(null, 'none')).toBe(false)
  })
})

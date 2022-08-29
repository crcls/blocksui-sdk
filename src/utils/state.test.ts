import get from 'lodash.get'

// @ts-ignore
import {
  initState,
  reducer,
  setState,
} from './state'

const config = [{
  children: [{
    children: [{
      children: [],
      connections: [],
      id: 'child2',
      props: {},
      state: {
        name: 'subchild2'
      },
      type: 'component'
    }],
    connections: [],
    id: 'child1',
    props: {},
    state: {
      name: 'subchild1'
    },
    type: 'component'
  }],
  connections: [],
  id: 'parent',
  props: {},
  state: {
    name: 'child1'
  },
  type: 'component'
}]

const state = [
  {
    name: 'child1',
    children: [
      {
        name: 'subchild1',
        children: [
          {
            name: 'subchild2',
            children: []
          }
        ]
      }
    ]
  }
]

describe('reducer', () => {
  test('should set a shallow state value correctly', () => {
    const path = '[0]'
    const key = 'name'
    const value = 'newName'

    const newState = reducer(state, setState(path, key, value))

    expect(get(newState, `${path}.${key}`)).toBe(value)
  })

  test('should set a deep state value correctly', () => {
    const path = '[0].children[0]'
    const key = 'name'
    const value = 'newName'

    const newState = reducer(state, setState(path, key, value))

    expect(get(newState, `${path}.${key}`)).toBe(value)
  })
})

describe('initState', () => {
  test('should properly transform config to state', () => {
    const transformedState = initState(config)
    expect(transformedState).toEqual(state)
  })

  test('handles minimal config', () => {
    const transformedState = initState([{ type: 'test' }])
    expect(transformedState).toEqual([{ children: [] }])
  })
})

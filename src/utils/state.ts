import cloneDeep from 'lodash.clonedeep'
import get from 'lodash.get'
import set from 'lodash.set'
import has from 'lodash.has'

import {
  ActionTypes,
  ActionType,
  BlockConfig,
  ChildConfig,
  ChildNode,
  Dispatcher,
  GetStateFunc,
  ResetStateAction,
  SetStateAction,
  StateNode,
  State,
  UpdateStateFunc,
  UpdateStateGenFunc
} from '../types'

export const setState = (
  path: string,
  key: string,
  value: any
): SetStateAction => (
  { type: ActionTypes.UPDATE, path, key, value }
)
export const resetState = (state: State): ResetStateAction => ({ type: ActionTypes.RESET, state })

export const reducer = (state: State, action: ActionType) => {
  if (action.type === ActionTypes.RESET) {
    return action.state
  } else if (has(state, action.path)) {
    const { key, path, value } = action
    let newState = cloneDeep(state)

    // Using a switch to make supporting more actions easier
    switch (action.type) {
      case ActionTypes.UPDATE: {
        set(newState, `${path}.${key}`, value)
        break
      }
      default:
        console.error(`Action: ${action} not supported.`)
        // no-op
    }

    return newState
  } else {
    return state
  }
}

export function initState(config: BlockConfig): State {
  return config.reduce((memo: State, childConfig: ChildNode) => {
    if (typeof childConfig === 'string') {
      return [...memo, null]
    }

    const state = cloneDeep((childConfig as ChildConfig).state || {})
    state.children = initState((childConfig as ChildConfig).children || [])

    return [...memo, state as StateNode]
  }, ([] as State))
}

export function getState(state: State): GetStateFunc {
  return function(path: string): StateNode {
    return get(state, path)
  }
}

export function updateState(dispatch: Dispatcher): UpdateStateGenFunc {
  return function(path: string): UpdateStateFunc {
    return function(key: string, value: any) {
      dispatch(setState(path, key, value))
    }
  }
}

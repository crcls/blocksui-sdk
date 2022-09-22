import React, {
  FC,
  ReactNode,
  Suspense,
  useEffect,
  useReducer,
  useState,
} from 'react'
import isEqual from 'lodash.isequal'

import { createConnections } from '../Connection.js'
import LazyLoader from './LazyLoader.js'

import {
  getState,
  initState,
  reducer,
  resetState,
  updateState,
} from '../utils/state.js'

import { ensureIds } from '../utils/id.js'

import BlockContext from '../Context.js'

import {
  BlockConfig,
  ConnectedNode,
  NodePathMap,
  PropsConfig,
} from '../types.js'

export function connectStateProps(
  nodePathMap: NodePathMap,
  props: PropsConfig
): { [key: string]: any } {
  return Object.entries(props).reduce<{ [key: string]: any }>(
    (memo, [key, value]) => {
      if (value === undefined) {
        return memo
      }

      if (value[0] === 'value') {
        memo[key] = value[1]
      } else {
        // Values that start with 'state:' will be parsed as a state key.
        // Going with this for now. We can figure out a different solution later if needed.
        memo[key] = `state:${nodePathMap[value[0]]}.${value[1]}`
      }

      return memo
    },
    {}
  )
}

// Recursively render the block tree
export function renderBlocks(
  host: string,
  config: ConnectedNode[],
  nodePathMap: { [key: string]: string }
): ReactNode {
  return config.map<ReactNode>((child) => {
    if (typeof child === 'string') {
      return child
    }
    const props = {
      className: child.className,
      connectConfig: child.connectionMap || [],
      context: BlockContext,
      id: child.id!,
      props: connectStateProps(nodePathMap, child.props || {}),
      stateKey: nodePathMap[child.id!],
    }

    return (
      <LazyLoader
        blocksHost={host}
        deps={child.deps || {}}
        key={child.id!}
        props={props}
        ref={child.ref}
        type={child.type}
      >
        {child.children !== undefined &&
          renderBlocks(host, child.children, nodePathMap)}
      </LazyLoader>
    )
  })
}

interface BlockContainerProps {
  host?: string
  config: BlockConfig
  loadingComponent?: ReactNode
}

const BlockContainer: FC<BlockContainerProps> = ({
  host = window.location.origin,
  config,
  loadingComponent,
}) => {
  const [state, dispatch] = useReducer(reducer, config, initState)
  const [configCache, setConfigCache] = useState(config)

  ensureIds(config)

  // Recursive routine that sets the component ID as the key
  // and an instance of a Connection as the value.
  const { connectedConfig, connections, nodePathMap } =
    createConnections(config)

  // Reset connections keys to the Connection ID
  Object.entries(connections).forEach(([cid, connect]) => {
    connections[connect.id] = connect
    delete connections[cid]
  })

  useEffect(() => {
    if (!isEqual(config, configCache)) {
      const newState = initState(config)
      dispatch(resetState(newState))
      setConfigCache(config)
    }
  }, [config, configCache])

  return (
    <BlockContext.Provider
      value={{
        connections,
        getState: getState(state),
        state,
        updateState: updateState(dispatch),
      }}
    >
      <Suspense fallback={loadingComponent || ''}>
        {renderBlocks(host, connectedConfig, nodePathMap)}
      </Suspense>
    </BlockContext.Provider>
  )
}

export default BlockContainer

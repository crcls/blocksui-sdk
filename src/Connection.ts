import { hasProp } from './utils/object'
import { createId } from './utils/id'

import {
  ActionHookMap,
  BlockConfig,
  ChildConfig,
  ConnectionConfig,
  ConnectedConfig,
  ConnectedNode,
  ConnectionResult,
  ConnectionDict,
  MethodDict,
  NodePathMap,
  PromiseDict,
} from './types'

/**
 * The idea behind this class is that each component in the
 * block tree will have an instance and it contains references
 * to hook methods from other components in the tree. The actions
 * dictionary for the owner component is passed to the actions
 * method which wraps the methods and includes the corresponding
 * hooks that it should call. This allows each component in the
 * tree to be able to call any hook from any other component and
 * it also allows the action to call multiple hooks.
 */

class Connection {
  public id: string

  private config: ConnectionConfig[]

  // action name for key and hook promises in a dictionary
  // with the hook name as the key.
  private hookMap: ActionHookMap

  constructor(config: ConnectionConfig[]) {
    this.id = createId()
    this.config = config
    this.hookMap = {} as ActionHookMap
  }

  public hooks(hooks: MethodDict, cid: string): void {
    for (let i = 0; i < this.config.length; i++) {
      const conf = this.config[i]
      const dict = this.hookMap[conf.action] || ({} as PromiseDict)

      Object.entries(conf.hooks).forEach(([compId, hookNames]) => {
        if (cid === compId) {
          hookNames.forEach((name) => {
            if (hooks[name].constructor.name === 'AsyncFunction') {
              dict[`${compId}:${name}`] = hooks[name]
            } else {
              dict[`${compId}:${name}`] = async function () {
                // @ts-ignore
                return hooks[name](...arguments)
              }
            }
          })
        }
      })

      this.hookMap[conf.action] = dict
    }
  }

  public actions(actions: MethodDict) {
    const that = this

    // Wraps each action method with a method that will also call
    // all the hooks connected to this action.
    Object.entries(actions).forEach(([name, action]) => {
      actions[name] = async (args: { [key: string]: any }) => {
        if (hasProp(that.hookMap, name)) {
          const hooks = Object.values(that.hookMap[name])

          if (hooks.length !== 0) {
            // TODO: allow these to return values
            Promise.all(hooks.map((func) => func(args)))
          }
        }

        if (action.constructor.name === 'AsyncFunction') {
          return action(args)
        } else {
          return Promise.resolve(action(args))
        }
      }
    })
  }
}

export default Connection

function isConfig(node: ConnectedNode): node is ConnectedConfig {
  return typeof node === 'object' && (node as ConnectedConfig).id !== undefined
}

// TODO: Make this more efficient. Maybe we should use an array of indexes
// for the cid. [0,10,4] would be the first top level component, the 10th
// child, and the 4th subchild. Then we could implement a B-Tree search algo.
export function addHooksToConnectMaps(
  config: ConnectedNode[],
  cid: string,
  hooks: { [key: string]: Set<string> }
) {
  for (let i = 0; i < config.length; i++) {
    const conf = config[i]
    if (isConfig(conf)) {
      if (conf.id === cid) {
        conf.connectionMap.hooks = hooks[cid]
        break
      } else if (conf.children !== undefined) {
        // If the parent cid doesn't match then check the children
        addHooksToConnectMaps(conf.children, cid, hooks)
      }
    }
  }
}

export function createConnections(blockConfig: BlockConfig): ConnectionResult {
  const hooks = {} as { [key: string]: Set<string> }
  const connectedConfig = [] as ConnectedNode[]
  const connections = {} as ConnectionDict
  const nodePathMap = {} as NodePathMap

  ;(function walk(bc: BlockConfig, cc: ConnectedNode[], path = '') {
    bc.forEach((conf: ChildConfig, i: number) => {
      if (typeof conf === 'string') {
        cc.push(conf)
        return
      }

      nodePathMap[conf.id!] = `${path}[${i}]`

      if (conf.id === undefined) {
        throw new Error('CreateConnections: ChildConfig is missing an ID')
      }

      if (conf.connections === undefined) {
        conf.connections = []
      }

      const connect = new Connection(conf.connections)
      const c = {
        ...conf,
        children: [],
        connectionMap: { hooks: new Set<string>(), owns: connect.id },
      }

      cc.push(c)
      connections[conf.id] = connect

      // recurse
      if (conf.children && conf.children.length > 0) {
        walk(conf.children, c.children, `${nodePathMap[conf.id]}.children`)
      }

      conf.connections.forEach((conn) => {
        Object.keys(conn.hooks).forEach((cid) => {
          if (!hasProp(hooks, cid)) {
            hooks[cid] = new Set<string>()
          }

          hooks[cid].add(connect.id)
        })
      })
    })
  })(blockConfig, connectedConfig)

  Object.keys(hooks).forEach((cid) => {
    addHooksToConnectMaps(connectedConfig, cid, hooks)
  })

  return { connectedConfig, connections, nodePathMap }
}

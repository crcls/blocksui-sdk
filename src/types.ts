import { RefObject } from 'react'

import Connection from './Connection'

// Props receive a tuple with one of two possible
// configurations. The first represents the basic
// configuration where 'value' is the key and the
// value is the prop's intented value. The second
// represents a state-to-prop configuration where
// the key is a component ID and the value is a
// state key. This allows any component in the
// tree to pass state values to another component
// in the tree.
export type PropConfig = ['value', any] | [string, string]
export type PropsConfig = { [key:string]: PropConfig | undefined }

export type NodePathMap = { [key:string]: string }

export interface ChildConfig {
  // Applied to the rendered component
  className?: string

  // Any child blocks to render
  children?: ChildNode[]

  // How to connect actions to hooks
  connections?: ConnectionConfig[]

  // Dependencies to pass into the block
  deps?: { [key:string]: any }

  // The ID of the block to render.
  // Used in connections.
  id?: string

  // Added to the rendered component
  props?: PropsConfig

  // Element ref
  ref?: RefObject<any>

  // initial state
  state?: { [key:string]: any }

  // Which component to render
  type: string
}

export type ChildNode = string | ChildConfig
export type BlockConfig = ChildNode[]

// State
export enum ActionTypes {
  UPDATE = 'UPDATE',
  RESET = 'RESET',
}

export interface SetStateAction {
  type: ActionTypes.UPDATE
  path: string
  key: string
  value: any
}

export interface ResetStateAction {
  type: ActionTypes.RESET
  state: State
}

export type ActionType =
  | SetStateAction
  | ResetStateAction

export type StateNode = {
  [key: string]: any,
  children: State
}

export type State = (StateNode | null)[]
export type Dispatcher = (action: ActionType) => void;
export type UpdateStateGenFunc = (path: string) => UpdateStateFunc
export type UpdateStateFunc = (key: string, value: any) => void
export type GetStateFunc = (path: string) => StateNode

// Context

export interface IBlockContext {
  getState: GetStateFunc
  state: State
  updateState: UpdateStateGenFunc
  // The connection ID and the connection class instance.
  // Each component in the tree will be passed a map that
  // defines which hooks and actions should be registered
  // with the connection.
  connections: ConnectionDict
}

// Connections

export type ActionHookMap = { [key:string]: PromiseDict }

export type ConnectionConfig = {
  // The action that triggers the hooks
  action: string,

  // A dictionary with component ids as the key
  // and a list of hooks this action should
  // trigger on that component
  hooks: HookDict
}

export type ConnectionDict = { [key:string]: Connection }

// Each component in the tree will receive a connection
// map that instructs which connections to register the
// hooks with and which connection to use to wrap the
// actions. The string value is a connection ID.
export type ConnectionMap = {
  hooks: Set<string>,
  owns: string
}

export interface ConnectedConfig extends ChildConfig {
  connectionMap: ConnectionMap
  children?: ConnectedNode[]
}

export type ConnectedNode = string | ConnectedConfig
export type MethodCall = (args: { [key:string]: any }) => any
export type MethodDict = { [key: string]: MethodCall }
export type PromiseDict = { [key:string]: (args: { [key:string]: any }) => Promise<any> }
export type HookDict = { [key:string]: string[] }

export interface ConnectionResult {
  connectedConfig: ConnectedNode[]
  connections: ConnectionDict
  nodePathMap: NodePathMap
}

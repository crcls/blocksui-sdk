import React, {
  ForwardRefRenderFunction,
  ReactNode,
  forwardRef,
  useState,
} from 'react'

import { loadPrimitive } from '../Primitive.js'

interface Props {
  blocksHost: string
  children?: ReactNode
  deps: { [key: string]: any }
  fetchOptions?: (options: Record<string, any>) => void
  props: { [key: string]: any }
  type: string
}

const LazyLoader: ForwardRefRenderFunction<HTMLElement, Props> = (
  { blocksHost, children, deps, props, type },
  ref
) => {
  const [primitive] = useState(loadPrimitive(type, deps))

  if (primitive.Component === undefined) {
    throw new Promise<void>((resolve, reject) => {
      primitive.Component === undefined ? reject() : resolve()
    })
  }

  return (
    // @ts-ignore
    <primitive.Component ref={ref} host={blocksHost} {...props}>
      {children}
    </primitive.Component>
  )
}

LazyLoader.displayName = 'LazyLoader'

export default forwardRef<HTMLElement, Props>(LazyLoader)

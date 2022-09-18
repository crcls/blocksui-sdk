import React, {
  ComponentType,
  ForwardRefRenderFunction,
  LazyExoticComponent,
  ReactNode,
  forwardRef,
  lazy,
  useState,
  useEffect,
} from 'react'

import { loadPrimitive } from '../Primitive'

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
  const [Component, setComponent] = useState<LazyExoticComponent<
    ComponentType<any>
  > | null>(null)

  useEffect(() => {
    if (Component === null) {
      loadPrimitive(type).then((primitive) => {
        const Comp = lazy(() =>
          import(/* webpackIgnore: true */ primitive.dataUrl).then((mod) => {
            return mod.default(React, deps)
          })
        )
        setComponent(Comp)
      })
    }
  }, [type])

  if (Component === null) {
    return <p>Loading</p>
  }

  return (
    // @ts-ignore
    <Component ref={ref} host={blocksHost} {...props}>
      {children}
    </Component>
  )
}

LazyLoader.displayName = 'LazyLoader'

export default forwardRef<HTMLElement, Props>(LazyLoader)

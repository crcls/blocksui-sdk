import React, {
  ComponentType,
  ForwardRefRenderFunction,
  LazyExoticComponent,
  ReactNode,
  forwardRef,
  lazy,
  useState,
  useEffect
} from 'react'

interface Props {
  blocksHost: string
  children?: ReactNode
  deps: { [key:string]: any }
  fetchOptions?: (options: Record<string, any>) => void
  props: { [key:string]: any }
  type: string,
}

const LazyLoader: ForwardRefRenderFunction<HTMLElement, Props> = ({
  blocksHost,
  children,
  deps,
  props,
  type
}, ref) => {
  const [Component, setComponent] = useState<LazyExoticComponent<ComponentType<any>> | null>(null)

  useEffect(() => {
    if (Component === null) {
      const Comp = lazy(() => (
        import(`${blocksHost}/assets/blocks/${type}.js`).then((mod) => mod.default(React, deps))
      ))
      setComponent(Comp)
    }
  }, [Component, type])

  if (Component === null) {
    const TempComp = lazy(() => new Promise(() => {}))
    return <TempComp />
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

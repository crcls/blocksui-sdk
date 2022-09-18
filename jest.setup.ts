import React from 'react'
import { TextEncoder, TextDecoder } from 'util'

interface SWindow extends Window {
  React: typeof React
  TextEncoder: typeof TextEncoder
  TextDecoder: typeof TextDecoder
}

declare let window: SWindow

window.TextEncoder = TextEncoder
window.TextDecoder = TextDecoder
window.React = React

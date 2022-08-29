import React from 'react'

interface SWindow extends Window {
  React: typeof React
}

declare let window: SWindow

window.React = React

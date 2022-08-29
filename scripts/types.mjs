import { spawn } from 'child_process'

const decoder = new TextDecoder()

export default function() {
  console.log('Watching Types')
  const proc = spawn('npm', ['run', 'type:check', '--', '-w'])

  proc.stdout.on('data', data => {
    const out = decoder.decode(data)
    if (out !== '') {
      console.log('[TS]', out)
    }
  })

  proc.stderr.on('data', data => {
    const out = decoder.decode(data)
    if (out !== '') {
      console.error('[TS:ERROR]', out)
    }
  })

  proc.on('close', code => {
    if (code > 0) {
      console.error(`TS exited with code ${code}`)
      process.exit(code)
    }
  })
}

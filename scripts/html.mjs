import fs from 'fs'

export default function () {
  console.log('Generating HTML')
  let html = fs.readFileSync('./test/index.html', { encoding: 'utf8' })
  fs.mkdirSync('./www', { recursive: true })
  fs.writeFileSync('./www/index.html', html)
}

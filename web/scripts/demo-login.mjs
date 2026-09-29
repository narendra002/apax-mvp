import { spawn } from 'node:child_process'
import { createServer } from 'node:http'

const DEMO_API_PORT = 4001
const DEMO_EMAIL = 'demo@apax.local'
const DEMO_PASSWORD = 'DemoPass123!'

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(payload))
}

const server = createServer((request, response) => {
  response.setHeader(
    'Access-Control-Allow-Origin',
    request.headers.origin ?? 'http://localhost:3000',
  )
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Vary', 'Origin')

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  if (request.method !== 'POST' || request.url !== '/user/login') {
    sendJson(response, 404, { success: false, message: 'Not found' })
    return
  }

  let body = ''
  request.on('data', (chunk) => {
    body += chunk
  })
  request.on('end', () => {
    try {
      const { email, password } = JSON.parse(body)
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        sendJson(response, 200, {
          success: true,
          user: { id: 'demo-user', email },
          token: 'demo.jwt.token',
        })
        return
      }
    } catch {
      sendJson(response, 400, { success: false, message: 'Invalid JSON' })
      return
    }

    sendJson(response, 401, {
      success: false,
      message: 'Invalid Email or Password',
    })
  })
})

const nextCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
let nextProcess

const stop = () => {
  if (nextProcess) {
    nextProcess.kill('SIGTERM')
  }
  server.close(() => process.exit(0))
}

server.listen(DEMO_API_PORT, () => {
  console.log(`Demo login API listening at http://localhost:${DEMO_API_PORT}`)
  console.log(`Demo credentials: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)

  nextProcess = spawn(nextCommand, ['next', 'dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_PUBLIC_API_BASE_URL: `http://localhost:${DEMO_API_PORT}`,
    },
  })

  nextProcess.on('exit', stop)
})

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

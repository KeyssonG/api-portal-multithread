import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const certPath = path.resolve(__dirname, './ssl/cert.pem')
const keyPath = path.resolve(__dirname, './ssl/key.pem')

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    },
    port: 5174,
    host: '0.0.0.0'
  }
})
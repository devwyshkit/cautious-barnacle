import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables for tests
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        include: ['tests/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['tests/**/*.e2e.{test,spec}.{ts,tsx}', 'node_modules'],
    },
})

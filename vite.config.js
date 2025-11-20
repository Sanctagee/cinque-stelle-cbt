import { resolve } from 'path'

export default {
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        exams: resolve(__dirname, 'exams.html'),
        testInterface: resolve(__dirname, 'test-interface.html')
      }
    }
  },
  server: {
    port: 3000
  }
}
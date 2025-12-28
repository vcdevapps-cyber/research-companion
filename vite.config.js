// No seu vite.config.js
export default defineConfig({
  plugins: [react(), VitePWA({ ... })],
  server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8787', // Alterado de 3000 para 8787
      changeOrigin: true,
      secure: false,
    }
  }
}
})
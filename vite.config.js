import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000, // 设置开发服务器端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 代理目标地址
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
      },
    },
  },
  plugins: [
    uni(),
  ],
})

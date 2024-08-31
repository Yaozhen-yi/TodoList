import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
    ],
    // 根据当前环境设置 base 路径
    base: mode === 'production' ? '/todoList/' : '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // 如果需要，还可以根据环境动态设置其他配置
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
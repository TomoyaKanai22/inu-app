import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // コンテナの外（ブラウザ）からのアクセスを許可する設定
    watch: {
      usePolling: true // Docker環境でファイルの変更を確実に検知させるお守り
    }
  }
})
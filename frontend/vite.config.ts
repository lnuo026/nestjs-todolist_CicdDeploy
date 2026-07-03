/**
：vite.config.ts 本来是给 Vite
  用的配置文件，TypeScript 默认不知道 defineConfig 里能写
  test: 这个字段（那是 vitest
  独有的）。这行注释是一种特殊语法（"三斜线指令"），告诉
  TS "把 vitest 的类型定义也加载进来"，这样 test: {...}
  才不会报类型错误。
*/
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})

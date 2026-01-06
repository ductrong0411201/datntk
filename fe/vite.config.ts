import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [copy({
    targets: [
      {
        src: "node_modules/@nutrient-sdk/viewer/dist/nutrient-viewer-lib",
        dest: "public/",
      },
    ],
    hook: "buildStart",
  }), react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  // server: {
  //   host: '0.0.0.0',
  //   port: 5173,
  //   proxy: {
  //     '/api': {
  //       target: 'http://be:3000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
})

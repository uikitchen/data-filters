import { resolve } from 'path';
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'react-data-hooks',
      fileName: 'react-data-hooks',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  },
  plugins: [
    react(), 
    dts({
      exclude: "stories"
    })
  ]
})
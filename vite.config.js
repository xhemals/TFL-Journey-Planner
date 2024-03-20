import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './',
  base: "/TFL-Journey-Planner/",
  homepage: "https://xhem.al/TFL-Journey-Planner/"
})
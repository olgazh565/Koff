import {defineConfig} from 'vite';
import autoprefixer from 'autoprefixer';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
	plugins: [
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
	],
	css: {
		preprocessorOptions: {
			scss: {},
		},
		postcss: {
			plugins: [autoprefixer()],
		},
	},
	build: {
		sourcemap: 'inline',
	},
});

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				darkest: 'var(--darkest)',
				darker: 'var(--darker)',
				light: 'var(--light)',
				lighter: 'var(--lighter)'
			}
		}
	},
	plugins: []
};

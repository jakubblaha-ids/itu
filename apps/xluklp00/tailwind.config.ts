import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors: {
			white: "#F7F7F7",
			gray: "#5E5E5E",
			blue: "#3A8DFF",
			red: "#FF6B6B",
			green: "#4CAF50",
			black: "#000000",
		}
	},

	plugins: []
} satisfies Config;

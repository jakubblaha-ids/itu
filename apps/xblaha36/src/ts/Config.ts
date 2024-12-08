import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type SortingType = 'alpha' | 'category';

interface Config {
	sorting: SortingType;
}

const defaultConfig: Config = {
	sorting: 'category'
};

export const config = writable(
	browser
		? (JSON.parse(localStorage.getItem('config') || 'null') as Config) || defaultConfig
		: defaultConfig
);

config.subscribe((config) => {
	if (!browser) {
		return;
	}

	localStorage.setItem('config', JSON.stringify(config));
});

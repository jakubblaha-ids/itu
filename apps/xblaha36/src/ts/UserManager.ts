// Jakub Blaha, xblaha36

import { browser } from '$app/environment';
import { UserManagerBase } from 'backend';
import { writable } from 'svelte/store';

// Binds name stored in local storage to a svelte store
export class UserManager extends UserManagerBase {
	username = writable<string | null>(null);

	constructor() {
		super({
			onUsernameChange: (username) => {
				this.username.set(username);
			}
		});

		if (browser) {
			this.username.set(this.getUsername());
		}
	}
}

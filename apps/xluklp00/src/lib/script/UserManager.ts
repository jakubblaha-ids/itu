// author: Pavel Lukl, xluklp00
// defines UserManager class

import { browser } from "$app/environment";
import { UserManagerBase } from "backend";
import { writable } from "svelte/store";

export class UserManager extends UserManagerBase {
    // svelte store for username
    username = writable<string | null>(null);

    constructor() {
        super({
            // change username handler
            onUsernameChange: (username) => {
                this.username.set(username);
            }
        });

        if(browser) {
            // set initial username
            this.username.set(this.getUsername());
        }
    }
}
import { UserManagerBase } from "backend";
import { writable } from "svelte/store";

export class UserManager extends UserManagerBase {
    username = writable<string | null>(null);

    constructor() {
        super({
            onUsernameChange: (username) => {
                console.log("Username changed to", username);
            }
        });
    }
}
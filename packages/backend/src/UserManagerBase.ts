// Jakub Blaha, xblaha36

export interface UserManagerBaseOptions {
    // Called when username is loaded from local storage.
    onUsernameChange?: (username: string) => void;
}

export class UserManagerBase {
    constructor(private options: UserManagerBaseOptions) {
        this.options = options;
    }

    /**
     * Set username in local storage and call `onUsernameChange` callback.
     * @param username
     */
    setUsername(username: string) {
        localStorage?.setItem("username", username);

        this.options.onUsernameChange?.(username);
    }

    /**
     * Get username from local storage.
     */
    getUsername() {
        return localStorage?.getItem("username") || "N/A";
    }
}

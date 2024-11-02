export interface UserManagerBaseOptions {
    onUsernameChange?: (username: string) => void;
}

export class UserManagerBase {
    constructor(private options: UserManagerBaseOptions) {
        this.options = options;
    }

    setUsername(username: string) {
        localStorage?.setItem("username", username);

        this.options.onUsernameChange?.(username);
    }

    getUsername() {
        return localStorage?.getItem("username") || "N/A";
    }
}

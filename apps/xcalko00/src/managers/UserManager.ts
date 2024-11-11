import { UserManagerBase } from 'backend';

export class UserManager extends UserManagerBase {

    username = 'admin';

    constructor() { super({}); }
    // async getUsers(): Promise<InUser[]> {
    //     return [
    //         {
    //             id: '1',
    //             name: 'User 1',
    //             email: ''
    //         },
}
// Jakub Blaha, xblaha36

import { getApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Used to retrieve instances of firebase services
export class ResourceManagerBase {
    protected firebaseApp: FirebaseApp | null = null;

    protected getApp() {
        if (!this.firebaseApp) {
            this.firebaseApp = getApp();
        }

        return this.firebaseApp;
    }

    protected get firestore() {
        return getFirestore(this.getApp());
    }
}

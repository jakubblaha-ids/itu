import { getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

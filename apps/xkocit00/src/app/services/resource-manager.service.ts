import { Injectable } from '@angular/core';
import { initializeApp, getApp, type FirebaseApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDpqj7ycSm2NPYE1OjAIjsWgnbY3OmvXsk',
  authDomain: 'shopping-list-b47e8.firebaseapp.com',
  projectId: 'shopping-list-b47e8',
  storageBucket: 'shopping-list-b47e8.appspot.com',
  messagingSenderId: '83924909024',
  appId: '1:83924909024:web:4bec0e1d9bcdd1956f8985',
};

/**
 * Service for managing resources wraps the Firebase Firestore
 *
 * @author Tomáš Kocí
 */

@Injectable({
  providedIn: 'root',
})
export class ResourceManagerService {
  private firebaseApp: FirebaseApp;
  private firestore: Firestore;

  constructor() {
    if (!getApps().length) {
      console.log('Initializing Firebase app');
      this.firebaseApp = initializeApp(firebaseConfig);
    } else {
      this.firebaseApp = getApp();
    }
    console.log(getApp());
    this.firestore = getFirestore(this.firebaseApp);
  }

  getFirestoreInstance(): Firestore {
    return this.firestore;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInStatusSource = new BehaviorSubject<boolean>(false);
  public loggedInStatus = this.loggedInStatusSource.asObservable();

  constructor() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      this.loggedInStatusSource.next(true);
    }
  }

  public login(username: string, password: string): void {
    if (username === 'admin' && password === 'admin') {
      this.loggedInStatusSource.next(true);
      localStorage.setItem('loggedIn', 'true');
    }
  }
}

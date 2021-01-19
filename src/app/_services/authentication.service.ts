import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse, User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  saveLogin(result: ApolloQueryResult<LoginResponse>) {
    localStorage.setItem('currentUser', JSON.stringify(result.data.login));
    this.currentUserSubject.next(result.data.login);
  }

  save(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

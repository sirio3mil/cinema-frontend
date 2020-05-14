import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

import {User} from '../_models';

const apiEndpoint = environment.apiEndpoint;

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<User[]>(`${apiEndpoint}/users`);
  }

  register(user: User) {
    return this.http.post(`${apiEndpoint}/users/register`, user);
  }

  delete(id: number) {
    return this.http.delete(`${apiEndpoint}/users/${id}`);
  }
}

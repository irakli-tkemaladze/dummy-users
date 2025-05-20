import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './customers/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProxyService {
  private httpService = inject(HttpClient);
  getUsersService(params: {
    limit: number;
    skip: number;
    q?: string;
  }): Observable<{
    limit: number;
    skip: number;
    total: number;
    users: User[];
  }> {
    return this.httpService.get(
      `https://dummyjson.com/users${params.q ? '/search' : ''}`,
      {
        params,
      }
    ) as Observable<{
      limit: number;
      skip: number;
      total: number;
      users: User[];
    }>;
  }

  PutUserService(
    id: number,
    body: { email: string; firstName: string; lastName: string }
  ) {
    return this.httpService.put(
      'https://dummyjson.com/users/' + id.toString(),
      body
    );
  }
  getOneUsr(uId: string): Observable<User> {
    return this.httpService.get(
      `https://dummyjson.com/users/${uId}`
    ) as Observable<User>;
  }
}

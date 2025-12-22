import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:5108/api/auth';

  private roleSubject = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res: LoginResponse): void => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        this.roleSubject.next(res.role);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.roleSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    const role: string | null = this.getRole();
    return role === 'admin' || role === 'Admin';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

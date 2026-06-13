import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from './environment';
import { User, UserRole } from './api.types';

interface AuthResponse {
  user: User;
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'lawmitran_token';
  private readonly userKey = 'lawmitran_user';
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.readUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => this.persist(response)),
    );
  }

  signup(payload: { name: string; email: string; phone?: string; password: string; role: UserRole }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((response) => this.persist(response)),
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    void this.router.navigateByUrl('/');
  }

  private persist(response: AuthResponse) {
    localStorage.setItem(this.tokenKey, response.accessToken);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private readUser() {
    const raw = localStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}

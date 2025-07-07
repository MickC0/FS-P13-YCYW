import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthResponse} from '../models/auth-response.model';
import {RegisterRequest} from '../models/register-request.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/api/v1/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API}/login`, credentials);
  }

  register(payload: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.API}/register`, payload);
  }

  saveToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  clearToken() {
    localStorage.removeItem('jwt');
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.roles?.[0] || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}


import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { RegisterRequest } from '../models/register-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/api/v1/auth`;
  private readonly TOKEN_KEY = 'jwt';

  private readonly _isLogged = signal<boolean>(!!this.getToken());
  readonly isLoggedSignal = this._isLogged.asReadonly();

  private readonly _email = signal<string | null>(this.getEmailFromToken());
  readonly email = this._email.asReadonly();
  private readonly _role = signal<string | null>(this.getRoleFromToken());
  readonly role = this._role.asReadonly();


  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<void> {
    return this.http.post<AuthResponse>(`${this.API}/login`, credentials).pipe(
      tap((resp) => {
        this.storeToken(resp.token);
        this._email.set(this.getEmailFromToken());
        this._role.set(this.getRoleFromToken());
        this._isLogged.set(true);
      }),
      map(() => void 0)
    );
  }

  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<AuthResponse>(`${this.API}/register`, payload).pipe(
      tap((resp) => {
        this.storeToken(resp.token);
        this._email.set(this.getEmailFromToken());
        this._role.set(this.getRoleFromToken());
        this._isLogged.set(true);
      }),
      map(() => void 0)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._isLogged.set(false);
    this._email.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.sub || null;
    } catch {
      return null;
    }
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.roles?.[0] || null;
    } catch {
      return null;
    }
  }
}

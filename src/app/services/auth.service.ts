import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface RegisterResponse {
  success: boolean;
  email: string;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  email: string;
  error?: string;
}

// Handles login/registration state and exposes helpers for guarded requests.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserEmail = new BehaviorSubject<string | null>(null);

  isLoggedIn$ = this.loggedIn.asObservable();
  currentUserEmail$ = this.currentUserEmail.asObservable();

  constructor(private http: HttpClient) {
    const savedEmail = localStorage.getItem('currentUserEmail');
    if (savedEmail) {
      this.loggedIn.next(true);
      this.currentUserEmail.next(savedEmail);
    }
  }

  register(email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { email, password });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
      tap(response => {
        if (response.success) {
          this.loggedIn.next(true);
          this.currentUserEmail.next(email);
          localStorage.setItem('currentUserEmail', email);
        }
      })
    );
  }

  logout(): void {
    this.loggedIn.next(false);
    this.currentUserEmail.next(null);
    localStorage.removeItem('currentUserEmail');
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  getCurrentUserEmail(): string | null {
    return this.currentUserEmail.value;
  }

  getAuthHeaders(): HttpHeaders {
    const email = this.getCurrentUserEmail();
    return email ? new HttpHeaders({ 'x-user-email': email }) : new HttpHeaders();
  }
}
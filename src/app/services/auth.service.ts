// Angular core & HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

// Response shapes from backend
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

/**
 * Central authentication service – singleton, manages login state for the entire app
 */
@Injectable({
  providedIn: 'root'                  // One instance shared across whole app
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  // Observable streams that broadcast login state to any subscriber
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserEmail = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Restore previous session on app startup
    const savedEmail = localStorage.getItem('currentUserEmail');
    if (savedEmail) {
      this.loggedIn.next(true);
      this.currentUserEmail.next(savedEmail);
    }
  }

  // Register new user – just forwards to backend
  register(email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { email, password });
  }

  // Login user and update global state on success
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            this.loggedIn.next(true);
            this.currentUserEmail.next(email);
            localStorage.setItem('currentUserEmail', email);   // persist session
          }
        })
      );
  }

  // Clear login state and localStorage
  logout(): void {
    this.loggedIn.next(false);
    this.currentUserEmail.next(null);
    localStorage.removeItem('currentUserEmail');
  }

  // Simple getter used by AuthGuard
  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  // Current user's email (or null)
  getCurrentUserEmail(): string | null {
    return this.currentUserEmail.value;
  }

  // Creates header used by CartService to identify user on backend
  getAuthHeaders(): HttpHeaders {
    const email = this.getCurrentUserEmail();
    return email ? new HttpHeaders({ 'x-user-email': email }) : new HttpHeaders();
  }
}
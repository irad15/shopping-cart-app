import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Login component that handles user authentication.
 * 
 * Features:
 * - Email and password validation
 * - Server-side authentication via AuthService
 * - Redirects to returnUrl after successful login (if provided)
 * - Displays error messages for failed login attempts
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  private returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    const returnUrlParam = this.route.snapshot.queryParamMap.get('returnUrl');
    this.returnUrl = returnUrlParam || '/';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
  
    const { email, password } = this.loginForm.value;
  
    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Redirect to the original URL (or home if none)
          const redirectTo = this.returnUrl || '/';
          this.router.navigateByUrl(redirectTo);
        } else {
          // This should never happen with your current backend,
          // but kept for safety
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        // This is the key line — show the real server message
        this.errorMessage = err.error?.error || 'Login failed. Please try again.';
      }
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}


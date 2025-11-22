import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Registration component that handles new user account creation.
 * 
 * Features:
 * - Email validation (required, valid email format)
 * - Password validation (minimum 6 characters, must contain capital letter)
 * - Password confirmation matching
 * - Automatic login after successful registration
 * - Redirects to products page on success
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordCapitalValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Custom validator: password must contain at least one capital letter.
   * @param control - The form control to validate
   * @returns Validation error object if invalid, null if valid
   */
  passwordCapitalValidator(control: any) {
    if (!control.value) return null;
    const hasCapital = /[A-Z]/.test(control.value);
    return hasCapital ? null : { noCapital: true };
  }

  /**
   * Custom validator: passwords must match.
   * @param form - The form group containing password and confirmPassword fields
   * @returns Validation error object if passwords don't match, null if they match
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
  
    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.registerForm.value;
  
    this.authService.register(email, password).subscribe({
      next: (response) => {
        if (response.success) {
          this.authService.login(email, password).subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.router.navigate(['/login'])
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed';
      }
    });
  }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}


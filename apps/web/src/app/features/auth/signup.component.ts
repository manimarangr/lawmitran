import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/services/api.types';

@Component({
  selector: 'lm-signup',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <main class="grid min-h-[calc(100vh-64px)] place-items-center bg-mist px-4 py-10">
      <mat-card class="w-full max-w-xl border border-slate-200 shadow-sm">
        <mat-card-content class="p-6">
          <h1 class="text-2xl font-extrabold text-ink">Create your Lawmitran account</h1>
          <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 grid gap-4 sm:grid-cols-2">
            <mat-form-field appearance="outline" class="sm:col-span-2">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="name" autocomplete="name">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" autocomplete="email">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Mobile Number</mat-label>
              <input matInput formControlName="phone" autocomplete="tel">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" autocomplete="new-password">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input matInput formControlName="confirmPassword" type="password" autocomplete="new-password">
            </mat-form-field>
            <mat-form-field appearance="outline" class="sm:col-span-2">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role">
                <mat-option value="CUSTOMER">Customer</mat-option>
                <mat-option value="LAWYER">Lawyer</mat-option>
              </mat-select>
            </mat-form-field>
            <p *ngIf="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{{ error }}</p>
            <button mat-raised-button color="primary" class="h-12 sm:col-span-2" type="submit">
              <mat-icon>person_add</mat-icon>
              Signup
            </button>
          </form>
          <p class="mt-5 text-center text-sm text-slate-600">
            Already registered?
            <a routerLink="/login" class="font-bold text-teal">Login</a>
          </p>
        </mat-card-content>
      </mat-card>
    </main>
  `,
})
export class SignupComponent {
  error = '';
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    role: ['CUSTOMER' as UserRole, Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (value.password !== value.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.auth
      .signup({
        name: value.name,
        email: value.email,
        phone: value.phone || undefined,
        password: value.password,
        role: value.role,
      })
      .subscribe({
        next: () => void this.router.navigateByUrl('/dashboard'),
        error: () => {
          this.error = 'Could not create this account. Try another email.';
        },
      });
  }
}

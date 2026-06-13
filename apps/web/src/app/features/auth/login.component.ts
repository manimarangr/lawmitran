import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'lm-login',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
    <main class="grid min-h-[calc(100vh-64px)] place-items-center bg-mist px-4 py-10">
      <mat-card class="w-full max-w-md border border-slate-200 shadow-sm">
        <mat-card-content class="p-6">
          <div class="mb-6 text-center">
            <mat-icon class="text-4xl text-gold">balance</mat-icon>
            <h1 class="mt-2 text-2xl font-extrabold text-ink">Welcome back</h1>
          </div>
          <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" autocomplete="email">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" autocomplete="current-password">
            </mat-form-field>
            <div class="flex items-center justify-between">
              <mat-checkbox formControlName="remember">Remember Me</mat-checkbox>
              <a class="text-sm font-semibold text-teal" href="#">Forgot Password</a>
            </div>
            <p *ngIf="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
            <button mat-raised-button color="primary" class="h-12" type="submit">
              <mat-icon>login</mat-icon>
              Login
            </button>
            <button mat-stroked-button type="button" class="h-12">
              <mat-icon>account_circle</mat-icon>
              Google Login
            </button>
          </form>
          <p class="mt-5 text-center text-sm text-slate-600">
            New to Lawmitran?
            <a routerLink="/signup" class="font-bold text-teal">Create account</a>
          </p>
        </mat-card-content>
      </mat-card>
    </main>
  `,
})
export class LoginComponent {
  error = '';
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true],
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
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => void this.router.navigateByUrl('/dashboard'),
      error: () => {
        this.error = 'Invalid email or password.';
      },
    });
  }
}

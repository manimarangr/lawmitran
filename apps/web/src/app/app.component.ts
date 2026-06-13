import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'lm-root',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, RouterOutlet, MatButtonModule, MatIconModule, MatToolbarModule],
  template: `
    <mat-toolbar class="sticky top-0 z-50 border-b border-white/10 bg-navy text-white">
      <a routerLink="/" class="flex items-center gap-2 text-lg font-extrabold tracking-normal">
        <mat-icon class="text-gold">balance</mat-icon>
        Lawmitran
      </a>
      <span class="flex-1"></span>
      <nav class="hidden items-center gap-1 md:flex">
        <a mat-button routerLink="/lawyers">Find Lawyers</a>
        <a mat-button routerLink="/dashboard">Dashboard</a>
      </nav>
      <ng-container *ngIf="auth.currentUser$ | async as user; else signedOut">
        <button mat-button (click)="auth.logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </ng-container>
      <ng-template #signedOut>
        <a mat-button routerLink="/login">Login</a>
        <a mat-raised-button color="accent" routerLink="/signup">Signup</a>
      </ng-template>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(public readonly auth: AuthService) {}
}

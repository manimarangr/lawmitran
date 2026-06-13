import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { ConsultationsService } from '../../core/services/consultations.service';

@Component({
  selector: 'lm-dashboard',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, MatCardModule, MatChipsModule, MatIconModule],
  template: `
    <main class="bg-mist py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section class="rounded-lg bg-navy p-6 text-white">
          <p class="text-sm font-bold uppercase tracking-[.16em] text-gold">Dashboard</p>
          <h1 class="mt-2 text-4xl font-extrabold" *ngIf="auth.currentUser$ | async as user">{{ user.name }}</h1>
        </section>

        <section class="mt-6 grid gap-4 md:grid-cols-3">
          <mat-card class="border border-slate-200 shadow-sm">
            <mat-card-content>
              <mat-icon class="text-gold">event_note</mat-icon>
              <h2 class="mt-2 text-2xl font-extrabold text-ink">Consultations</h2>
              <p class="text-slate-600">Bookings, status, documents, notes, and payment tracking.</p>
            </mat-card-content>
          </mat-card>
          <mat-card class="border border-slate-200 shadow-sm">
            <mat-card-content>
              <mat-icon class="text-teal">folder</mat-icon>
              <h2 class="mt-2 text-2xl font-extrabold text-ink">Documents</h2>
              <p class="text-slate-600">Upload and manage legal documents and certificates.</p>
            </mat-card-content>
          </mat-card>
          <mat-card class="border border-slate-200 shadow-sm">
            <mat-card-content>
              <mat-icon class="text-navy">verified</mat-icon>
              <h2 class="mt-2 text-2xl font-extrabold text-ink">Profile</h2>
              <p class="text-slate-600">Manage identity, lawyer profile, availability, and reviews.</p>
            </mat-card-content>
          </mat-card>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl font-extrabold text-ink">Recent consultations</h2>
          <div class="mt-4 grid gap-4">
            <mat-card *ngFor="let item of consultations$ | async" class="border border-slate-200 shadow-sm">
              <mat-card-content class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 class="font-bold text-ink">{{ item.lawyer.user.name }}</h3>
                  <p class="text-sm text-slate-600">{{ item.consultationDate | date: 'medium' }}</p>
                  <p class="mt-1 text-sm text-slate-600">{{ item.notes }}</p>
                </div>
                <mat-chip-set>
                  <mat-chip>{{ item.status }}</mat-chip>
                  <mat-chip>{{ item.paymentStatus }}</mat-chip>
                </mat-chip-set>
              </mat-card-content>
            </mat-card>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class DashboardComponent {
  consultations$ = this.consultations.mine();

  constructor(
    public readonly auth: AuthService,
    private readonly consultations: ConsultationsService,
  ) {}
}

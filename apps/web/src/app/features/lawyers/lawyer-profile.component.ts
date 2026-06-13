import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { ConsultationsService } from '../../core/services/consultations.service';
import { LawyersService } from '../../core/services/lawyers.service';

@Component({
  selector: 'lm-lawyer-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    NgFor,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
    <main class="bg-mist py-10" *ngIf="lawyer$ | async as lawyer">
      <div class="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <section class="rounded-lg bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-5 sm:flex-row">
            <img
              class="h-28 w-28 rounded-lg object-cover"
              [src]="lawyer.user.profilePhoto || fallbackPhoto"
              [alt]="lawyer.user.name"
            >
            <div>
              <a routerLink="/lawyers" class="text-sm font-semibold text-teal">Back to lawyers</a>
              <h1 class="mt-2 text-4xl font-extrabold text-ink">{{ lawyer.user.name }}</h1>
              <p class="mt-2 text-slate-600">{{ lawyer.experience }} years experience | {{ lawyer.city }}</p>
              <p class="mt-2 flex items-center gap-1 font-semibold text-gold">
                <mat-icon>star</mat-icon>
                {{ lawyer.rating || 0 }} rating from {{ lawyer.reviewCount || 0 }} reviews
              </p>
            </div>
          </div>

          <mat-chip-set class="mt-6">
            <mat-chip *ngFor="let area of lawyer.practiceAreas">{{ area.name }}</mat-chip>
          </mat-chip-set>

          <div class="mt-8 grid gap-6">
            <section>
              <h2 class="text-xl font-bold text-ink">Bio</h2>
              <p class="mt-2 leading-7 text-slate-700">{{ lawyer.bio }}</p>
            </section>
            <section>
              <h2 class="text-xl font-bold text-ink">Languages</h2>
              <p class="mt-2 text-slate-700">{{ lawyer.languages.join(', ') }}</p>
            </section>
            <section>
              <h2 class="text-xl font-bold text-ink">Education</h2>
              <ul class="mt-2 grid gap-2 text-slate-700">
                <li *ngFor="let education of lawyer.educations">
                  {{ education.degree }}, {{ education.institute }} ({{ education.year }})
                </li>
              </ul>
            </section>
            <section>
              <h2 class="text-xl font-bold text-ink">Reviews</h2>
              <div class="mt-3 grid gap-3">
                <blockquote *ngFor="let review of lawyer.reviews" class="rounded-lg bg-mist p-4">
                  <p class="font-semibold text-gold">{{ review.rating }} / 5</p>
                  <p class="mt-1 text-slate-700">{{ review.comment }}</p>
                  <footer class="mt-2 text-sm text-slate-500">{{ review.customer.name }} | {{ review.createdAt | date }}</footer>
                </blockquote>
              </div>
            </section>
          </div>
        </section>

        <aside>
          <mat-card class="sticky top-24 border border-slate-200 shadow-sm">
            <mat-card-content class="p-5">
              <p class="text-sm font-bold uppercase tracking-[.14em] text-gold">Consultation</p>
              <h2 class="mt-2 text-3xl font-extrabold text-ink">
                {{ +lawyer.consultationFee | currency: 'INR':'symbol':'1.0-0' }}
              </h2>
              <form [formGroup]="bookingForm" (ngSubmit)="book(lawyer.id)" class="mt-5 grid gap-4">
                <mat-form-field appearance="outline">
                  <mat-label>Date and time</mat-label>
                  <input matInput type="datetime-local" formControlName="consultationDate">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Notes</mat-label>
                  <textarea matInput rows="4" formControlName="notes"></textarea>
                </mat-form-field>
                <p *ngIf="message" class="rounded-md bg-teal-50 p-3 text-sm text-teal-700">{{ message }}</p>
                <a *ngIf="!(auth.currentUser$ | async)" mat-stroked-button routerLink="/login">Login to book</a>
                <button *ngIf="auth.currentUser$ | async" mat-raised-button color="primary" class="h-12" type="submit">
                  <mat-icon>event_available</mat-icon>
                  Book Consultation
                </button>
              </form>
            </mat-card-content>
          </mat-card>
        </aside>
      </div>
    </main>
  `,
})
export class LawyerProfileComponent {
  fallbackPhoto = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=220&q=80';
  message = '';
  lawyer$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((id) => this.lawyers.get(id)),
  );
  bookingForm = this.fb.nonNullable.group({
    consultationDate: ['', Validators.required],
    notes: [''],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly lawyers: LawyersService,
    private readonly consultations: ConsultationsService,
    public readonly auth: AuthService,
  ) {}

  book(lawyerId: string) {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    const value = this.bookingForm.getRawValue();
    this.consultations
      .book({
        lawyerId,
        consultationDate: new Date(value.consultationDate),
        notes: value.notes,
      })
      .subscribe(() => {
        this.message = 'Consultation request submitted.';
        this.bookingForm.reset();
      });
  }
}

import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LawyerCardComponent } from '../../shared/lawyer-card.component';
import { LawyersService } from '../../core/services/lawyers.service';

@Component({
  selector: 'lm-home',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    LawyerCardComponent,
  ],
  template: `
    <section class="relative min-h-[calc(100vh-64px)] overflow-hidden bg-navy text-white">
      <img
        class="absolute inset-0 h-full w-full object-cover opacity-35"
        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1800&q=85"
        alt="Law library"
      >
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,58,.96),rgba(11,31,58,.72),rgba(11,31,58,.34))]"></div>
      <div class="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="mb-4 text-sm font-bold uppercase tracking-[.18em] text-gold">Verified legal marketplace</p>
          <h1 class="text-5xl font-extrabold leading-tight sm:text-6xl">Legal Help, Simplified.</h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
            Connect with verified lawyers, book consultations, and access legal services online.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a mat-raised-button color="accent" routerLink="/lawyers">
              <mat-icon>search</mat-icon>
              Find Lawyers
            </a>
            <a mat-stroked-button class="border-white text-white" routerLink="/signup">
              <mat-icon>support_agent</mat-icon>
              Get Legal Help
            </a>
          </div>
        </div>

        <form
          [formGroup]="searchForm"
          (ngSubmit)="search()"
          class="mt-10 grid gap-3 rounded-lg border border-white/15 bg-white/95 p-4 text-ink shadow-xl md:grid-cols-5"
          aria-label="Lawyer search"
        >
          <mat-form-field appearance="outline">
            <mat-label>Practice Area</mat-label>
            <mat-select formControlName="practiceArea">
              <mat-option value="">Any</mat-option>
              <mat-option *ngFor="let area of practiceAreas$ | async" [value]="area.name">{{ area.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>City</mat-label>
            <input matInput formControlName="city" placeholder="Delhi">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Language</mat-label>
            <input matInput formControlName="language" placeholder="Hindi">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Experience</mat-label>
            <input matInput type="number" formControlName="experience" min="0">
          </mat-form-field>
          <button mat-raised-button color="primary" class="h-14 self-start" type="submit">
            <mat-icon>manage_search</mat-icon>
            Search
          </button>
        </form>
      </div>
    </section>

    <main>
      <section class="bg-white py-14">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-8 flex items-end justify-between gap-4">
            <div>
              <p class="text-sm font-bold uppercase tracking-[.16em] text-gold">Practice areas</p>
              <h2 class="mt-2 text-3xl font-extrabold text-ink">Find the right legal expertise</h2>
            </div>
            <a mat-button routerLink="/lawyers">View all</a>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <mat-card *ngFor="let area of practiceAreas$ | async" class="border border-slate-200 shadow-sm">
              <mat-card-content>
                <mat-icon class="mb-3 text-gold">gavel</mat-icon>
                <h3 class="text-lg font-bold text-ink">{{ area.name }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ area.description }}</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </section>

      <section class="bg-mist py-14">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-extrabold text-ink">Featured lawyers</h2>
          <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <lm-lawyer-card *ngFor="let lawyer of featured$ | async" [lawyer]="lawyer"></lm-lawyer-card>
          </div>
        </div>
      </section>

      <section class="bg-white py-14">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p class="text-sm font-bold uppercase tracking-[.16em] text-gold">Legal documents</p>
            <h2 class="mt-2 text-3xl font-extrabold text-ink">Popular documents</h2>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <div *ngFor="let document of documents" class="rounded-lg border border-slate-200 bg-white p-4">
                <mat-icon class="text-teal">description</mat-icon>
                <strong class="ml-2">{{ document }}</strong>
              </div>
            </div>
          </div>
          <div>
            <p class="text-sm font-bold uppercase tracking-[.16em] text-gold">How it works</p>
            <div class="mt-6 grid gap-4">
              <div *ngFor="let step of steps; let i = index" class="flex gap-4 rounded-lg bg-mist p-5">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy font-bold text-white">
                  {{ i + 1 }}
                </span>
                <div>
                  <h3 class="font-bold text-ink">{{ step.title }}</h3>
                  <p class="text-sm leading-6 text-slate-600">{{ step.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-navy py-14 text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-extrabold">Trusted by customers</h2>
          <div class="mt-8 grid gap-5 md:grid-cols-3">
            <blockquote *ngFor="let quote of testimonials" class="rounded-lg border border-white/10 bg-white/10 p-5">
              <p class="leading-7 text-slate-100">"{{ quote.text }}"</p>
              <footer class="mt-4 font-bold text-gold">{{ quote.name }}</footer>
            </blockquote>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class HomeComponent {
  practiceAreas$ = this.lawyers.practiceAreas();
  featured$ = this.lawyers.featured();
  searchForm = this.fb.nonNullable.group({
    practiceArea: [''],
    city: [''],
    language: [''],
    experience: [''],
  });
  documents = ['Rental Agreement', 'Affidavit', 'Power of Attorney', 'Legal Notice', 'Employment Agreement'];
  steps = [
    { title: 'Search Lawyer', text: 'Compare verified advocates by practice area, city, language, and experience.' },
    { title: 'Book Consultation', text: 'Pick a convenient appointment and share supporting documents securely.' },
    { title: 'Get Legal Help', text: 'Track consultation status, payments, notes, and follow-up actions.' },
  ];
  testimonials = [
    { name: 'Priya S.', text: 'Lawmitran helped me find a property lawyer in one afternoon.' },
    { name: 'Rahul M.', text: 'The consultation was clear, documented, and easy to manage online.' },
    { name: 'Neha K.', text: 'I could compare lawyers and fees before booking. That transparency matters.' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly lawyers: LawyersService,
  ) {}

  search() {
    void this.router.navigate(['/lawyers'], { queryParams: this.searchForm.getRawValue() });
  }
}

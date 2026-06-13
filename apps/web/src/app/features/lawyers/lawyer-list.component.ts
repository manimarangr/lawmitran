import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LawyersService } from '../../core/services/lawyers.service';
import { LawyerCardComponent } from '../../shared/lawyer-card.component';

@Component({
  selector: 'lm-lawyer-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    LawyerCardComponent,
  ],
  template: `
    <main class="bg-mist py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-6">
          <p class="text-sm font-bold uppercase tracking-[.16em] text-gold">Find lawyers</p>
          <h1 class="mt-2 text-4xl font-extrabold text-ink">Verified legal experts</h1>
        </div>
        <form [formGroup]="filters" (ngSubmit)="apply()" class="grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-5">
          <mat-form-field appearance="outline">
            <mat-label>Practice Area</mat-label>
            <mat-select formControlName="practiceArea">
              <mat-option value="">Any</mat-option>
              <mat-option *ngFor="let area of practiceAreas$ | async" [value]="area.name">{{ area.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>City</mat-label>
            <input matInput formControlName="city">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Language</mat-label>
            <input matInput formControlName="language">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Experience</mat-label>
            <input matInput type="number" min="0" formControlName="experience">
          </mat-form-field>
          <button mat-raised-button color="primary" class="h-14" type="submit">
            <mat-icon>filter_alt</mat-icon>
            Apply
          </button>
        </form>

        <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <lm-lawyer-card *ngFor="let lawyer of (result$ | async)?.items" [lawyer]="lawyer"></lm-lawyer-card>
        </div>
      </div>
    </main>
  `,
})
export class LawyerListComponent {
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  practiceAreas$ = this.lawyers.practiceAreas();
  filters = this.fb.nonNullable.group({
    practiceArea: [''],
    city: [''],
    language: [''],
    experience: [''],
  });
  result$ = combineLatest([this.route.queryParamMap, this.refresh$]).pipe(
    map(([params]) => ({
      practiceArea: params.get('practiceArea') ?? this.filters.value.practiceArea ?? '',
      city: params.get('city') ?? this.filters.value.city ?? '',
      language: params.get('language') ?? this.filters.value.language ?? '',
      experience: Number(params.get('experience') || this.filters.value.experience || 0) || undefined,
    })),
    switchMap((filters) => this.lawyers.search(filters)),
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly lawyers: LawyersService,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.filters.patchValue({
        practiceArea: params.get('practiceArea') ?? '',
        city: params.get('city') ?? '',
        language: params.get('language') ?? '',
        experience: params.get('experience') ?? '',
      });
    });
  }

  apply() {
    this.refresh$.next();
  }
}

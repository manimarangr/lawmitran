import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Lawyer } from '../core/services/api.types';

@Component({
  selector: 'lm-lawyer-card',
  standalone: true,
  imports: [CurrencyPipe, NgFor, RouterLink, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  template: `
    <mat-card class="h-full border border-slate-200 bg-white shadow-sm">
      <mat-card-content class="flex h-full flex-col gap-4">
        <div class="flex items-start gap-4">
          <img
            class="h-16 w-16 rounded-md object-cover"
            [src]="lawyer.user.profilePhoto || fallbackPhoto"
            [alt]="lawyer.user.name"
          >
          <div class="min-w-0">
            <h3 class="text-lg font-bold text-ink">{{ lawyer.user.name }}</h3>
            <p class="text-sm text-slate-600">{{ lawyer.experience }} years experience | {{ lawyer.city }}</p>
            <p class="mt-1 flex items-center gap-1 text-sm font-semibold text-gold">
              <mat-icon class="text-base">star</mat-icon>
              {{ lawyer.rating || 0 }} ({{ lawyer.reviewCount || 0 }})
            </p>
          </div>
        </div>
        <mat-chip-set>
          <mat-chip *ngFor="let area of lawyer.practiceAreas.slice(0, 3)">{{ area.name }}</mat-chip>
        </mat-chip-set>
        <p class="line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{{ lawyer.bio }}</p>
        <div class="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <strong class="text-ink">{{ +lawyer.consultationFee | currency: 'INR':'symbol':'1.0-0' }}</strong>
          <a mat-raised-button color="primary" [routerLink]="['/lawyers', lawyer.id]">
            <mat-icon>event_available</mat-icon>
            Book
          </a>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class LawyerCardComponent {
  @Input({ required: true }) lawyer!: Lawyer;
  fallbackPhoto = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=160&q=80';
}

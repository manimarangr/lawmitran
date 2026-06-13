import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Lawyer, PracticeArea } from './api.types';

export interface LawyerSearch {
  practiceArea?: string;
  city?: string;
  language?: string;
  experience?: number;
}

@Injectable({ providedIn: 'root' })
export class LawyersService {
  constructor(private readonly http: HttpClient) {}

  practiceAreas() {
    return this.http.get<PracticeArea[]>(`${environment.apiUrl}/practice-areas`);
  }

  featured() {
    return this.http.get<Lawyer[]>(`${environment.apiUrl}/lawyers/featured`);
  }

  search(filters: LawyerSearch = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<{ items: Lawyer[]; total: number }>(`${environment.apiUrl}/lawyers`, { params });
  }

  get(id: string) {
    return this.http.get<Lawyer>(`${environment.apiUrl}/lawyers/${id}`);
  }
}

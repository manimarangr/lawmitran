import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Consultation } from './api.types';

@Injectable({ providedIn: 'root' })
export class ConsultationsService {
  constructor(private readonly http: HttpClient) {}

  mine() {
    return this.http.get<Consultation[]>(`${environment.apiUrl}/consultations`);
  }

  book(payload: { lawyerId: string; consultationDate: Date; notes?: string; documentUrls?: string[] }) {
    return this.http.post<Consultation>(`${environment.apiUrl}/consultations`, payload);
  }
}

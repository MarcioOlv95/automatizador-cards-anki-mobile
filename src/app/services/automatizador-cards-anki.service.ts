import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AutomatizadorCardsAnkiReponse } from '../models/automatizador-cards-anki-response';

@Injectable({
  providedIn: 'root'
})
export class AutomatizadorCardsAnkiService {
  private controller = "anki";
  
  constructor(private http: HttpClient) { }

  insertCards(words: []): Observable<AutomatizadorCardsAnkiReponse> {
    return this.http.post<AutomatizadorCardsAnkiReponse>(`${environment.apiUrl}/${this.controller}/insert-cards`, { words: words } );
  }
}

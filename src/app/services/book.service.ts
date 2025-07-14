import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book } from '../book';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<Book[]> {
    if (!query.trim()) {
      return of([]);
    }

    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}`;
    return this.http.get<any>(url).pipe(
      map((res) =>
        res.docs.map((doc: any) => ({
          key: doc.key,
          title: doc.title,
          author_name: doc.author_name,
          first_publish_year: doc.first_publish_year,
          cover_id: doc.cover_i,
        }))
      ),
      catchError((err) => {
        console.error('Error while searching for books :', err);
        return of([]);
      })
    );
  }

  getBookDetails(bookId: string): Observable<any> {
    return this.http.get(`https://openlibrary.org/works/${bookId}.json`);
  }

  getAuthorDetails(authorKey: string): Observable<any> {
    return this.http.get(`https://openlibrary.org${authorKey}.json`);
  }

  selectedBook: Book | null = null;
}

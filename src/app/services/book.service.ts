import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Book } from '../book';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  searchBooks(
    query: string
  ): Observable<{ books: Book[]; loading: boolean; error: string | null }> {
    if (!query.trim()) return of({ books: [], loading: false, error: null });

    return this.http
      .get<any>(`${this.apiUrl}?q=${encodeURIComponent(query)}`)
      .pipe(
        tap(() => console.log('Searching for:', query)),
        map((response) => ({
          books: response.docs.map((doc: any) => ({
            key: doc.key,
            title: doc.title,
            author_name: doc.author_name,
            first_publish_year: doc.first_publish_year,
            cover_id: doc.cover_i,
          })),
          loading: false,
          error: null,
        })),
        catchError((error) => {
          console.error('Search error:', error);
          return of({
            books: [],
            loading: false,
            error: 'Failed to fetch books. Please try again later.',
          });
        })
      );
  }

  getBookDetails(bookId: string): Observable<any> {
    const url = `https://openlibrary.org/works/${bookId}.json`;
    return this.http.get(url);
  }

  getAuthorName(authorKey: string): Observable<any> {
    return this.http.get(`https://openlibrary.org${authorKey}.json`);
  }

  selectedBook: Book | null = null;
}
export { Book };

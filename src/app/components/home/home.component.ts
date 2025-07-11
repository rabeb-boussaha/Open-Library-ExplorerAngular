import { Component } from '@angular/core';
import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  books: Book[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';

  constructor(private bookService: BookService) {}

  onSearch(query: string): void {
    this.searchQuery = query;
    if (!query.trim()) {
      this.books = [];
      this.error = null;
      return;
    }

    this.loading = true;
    this.error = null;

    this.bookService.searchBooks(query).subscribe({
      next: (result) => {
        this.books = result.books;
        this.loading = result.loading;
        this.error = result.error;

        if (this.books.length === 0 && !this.error) {
          this.error = 'No results found. Try different search terms.';
        }
      },
      error: (err) => {
        this.error = 'Network error. Please check your connection.';
        this.loading = false;
      },
    });
  }
}

import { Component } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from 'src/app/book';

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
      next: (books) => {
        this.books = books;
        this.loading = false;

        if (books.length === 0) {
          this.error = 'No results found. Try different search terms.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'An error occurred while searching for books.';
      },
    });
  }
}

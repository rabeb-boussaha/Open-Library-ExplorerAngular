import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() loading = false;

  coverError = false;

  constructor(private router: Router, private bookService: BookService) {}

  get coverUrl(): string | null {
    if (!this.book.cover_id || this.coverError) {
      return null;
    }
    return `https://covers.openlibrary.org/b/id/${this.book.cover_id}-M.jpg`;
  }

  get authors(): string {
    return this.book.author_name?.join(', ') || 'Unknown author';
  }

  get publishedYear(): string {
    return this.book.first_publish_year?.toString() || 'Unknown year';
  }

  onCoverError(): void {
    this.coverError = true;
  }

  openDetails(): void {
    const key = this.book.key;
    const bookId = key.split('/').pop();

    this.bookService.selectedBook = this.book;
    this.router.navigate(['/book', bookId]);
  }

  viewDetails(): void {
    if (this.book?.key) {
      const bookId = this.book.key.split('/').pop();
      this.bookService.selectedBook = this.book;
      this.router.navigate(['/book', bookId]);
    }
  }
}

import { Component, Input } from '@angular/core';
import { Book } from '../../book';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() loading = false;

  constructor(private router: Router, private bookService: BookService) {}

  coverError = false;

  get publishedYear(): string {
    return this.book.first_publish_year?.toString() || 'Unknown date';
  }
  get authors(): string {
    return this.book.author_name.join(', ') || 'Unknown autho';
  }
  get coverUrl(): string | null {
    if (this.coverError || !this.book.cover_id) return null;
    return `https://covers.openlibrary.org/b/id/${this.book.cover_id}-M.jpg`;
  }

  handleImageError(): void {
    this.coverError = true;
  }

  viewDetails(): void {
    if (this.book?.key) {
      const bookId = this.book.key.split('/').pop();
      this.bookService.selectedBook = this.book;
      this.router.navigate(['/book', bookId]);
    }
  }
}
export { Book };

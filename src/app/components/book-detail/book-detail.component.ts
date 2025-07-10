import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  bookId: string = '';
  book: any = null;
  bookDescription: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.bookId = params.get('id') || '';
          this.loading = true;
          return this.bookService.getBookDetails(this.bookId);
        }),
        catchError((error) => {
          console.error('Error loading book details', error);
          this.loading = false;
          return of(null);
        })
      )
      .subscribe({
        next: (details) => {
          this.book = details;
          this.loadAuthorName();
          this.loadBookDescription();
          this.loading = false;
        },
      });
  }

  loadBookDescription(): void {
    if (this.book?.description) {
      if (typeof this.book.description === 'string') {
        this.bookDescription = this.book.description;
      } else if (this.book.description.value) {
        this.bookDescription = this.book.description.value;
      }
    } else {
      this.bookDescription = 'This book does not have a description yet.';
    }
  }

  getLargeCover(): string {
    if (this.book?.covers?.length) {
      return `https://covers.openlibrary.org/b/id/${this.book.covers[0]}-L.jpg`;
    }
    return 'assets/default-book-cover-large.jpg';
  }

  getAuthors(): string {
    return Array.isArray(this.book?.author_name) &&
      this.book.author_name.length > 0
      ? this.book.author_name.join(', ')
      : 'Unknown author';
  }
  loadAuthorName(): void {
    const authorRef = this.book?.authors?.[0]?.author?.key;
    if (authorRef) {
      this.bookService.getAuthorName(authorRef).subscribe({
        next: (data) => {
          this.book.author_name = [data.name];
        },
        error: () => {
          this.book.author_name = ['Unknown author'];
        },
      });
    } else {
      this.book.author_name = ['Unknown author'];
    }
  }

  getPublishedYear(): string {
    return this.book?.first_publish_date || 'Unknown date';
  }

  getISBN(): string | null {
    if (this.book?.isbn?.length) {
      return this.book.isbn[0];
    }
    return null;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

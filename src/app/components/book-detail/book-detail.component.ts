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
  error: string | null = null;

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
          return this.bookService.getBookDetails(this.bookId);
        }),
        catchError((err) => {
          console.error('Failed to load book details:', err);
          this.error = 'Unable to load book details.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((book) => {
        if (book) {
          this.book = book;
          this.setDescription();
          this.loadAuthorName();
        }
        this.loading = false;
      });
  }

  setDescription(): void {
    const desc = this.book?.description;
    if (!desc) {
      this.bookDescription = 'No description available.';
    } else if (typeof desc === 'string') {
      this.bookDescription = desc;
    } else {
      this.bookDescription = desc.value || 'No description available.';
    }
  }

  loadAuthorName(): void {
    const authorKey = this.book?.authors?.[0]?.author?.key;
    if (authorKey) {
      this.bookService.getAuthorDetails(authorKey).subscribe({
        next: (author) => {
          this.book.author_name = [author.name];
        },
        error: () => {
          this.book.author_name = ['Unknown author'];
        },
      });
    } else {
      this.book.author_name = ['Unknown author'];
    }
  }

  getCoverUrl(): string {
    const coverId = this.book?.covers?.[0];
    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : 'assets/default-book-cover-large.jpg';
  }

  getAuthors(): string {
    return this.book?.author_name?.join(', ') || 'Unknown author';
  }

  getPublishedYear(): string {
    return this.book?.first_publish_date || 'Unknown year';
  }

  getISBN(): string {
    return this.book?.isbn?.[0] || 'Not available';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

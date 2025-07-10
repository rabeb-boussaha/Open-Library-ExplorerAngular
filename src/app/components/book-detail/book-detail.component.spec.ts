import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookDetailComponent } from './book-detail.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { BookService } from '../../services/book.service';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;

  const activatedRouteStub = {
    paramMap: of(convertToParamMap({ id: 'OL12345W' })),
  };

  const bookServiceStub = {
    getBookDetails: jasmine.createSpy('getBookDetails').and.returnValue(
      of({
        key: 'OL12345W',
        title: 'Test Book',
        authors: [{ author: { key: '/authors/OL1A' } }],
        description: 'Test description',
        covers: [123456],
        first_publish_date: '2020',
        isbn: ['1234567890'],
      })
    ),
    getAuthorName: jasmine
      .createSpy('getAuthorName')
      .and.returnValue(of({ name: 'Test Author' })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BookService, useValue: bookServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load book details', () => {
    expect(component).toBeTruthy();
    expect(bookServiceStub.getBookDetails).toHaveBeenCalledWith('OL12345W');
    expect(component.book.title).toBe('Test Book');
    expect(component.bookDescription).toContain('Test description');
  });
});

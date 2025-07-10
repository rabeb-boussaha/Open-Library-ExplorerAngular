import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css'],
})
export class SearchBoxComponent implements OnDestroy {
  searchControl = new FormControl('');
  @Output() search = new EventEmitter<string>();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((query) => this.search.emit(this.sanitizeQuery(query)));
  }

  onSearch() {
    this.search.emit(this.sanitizeQuery(this.searchControl.value));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private sanitizeQuery(query: string | null): string {
    return query?.trim() || '';
  }
}

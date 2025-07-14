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
      .subscribe((query) => this.search.emit(this.cleanQuery(query)));
  }

  onSearch(): void {
    this.search.emit(this.cleanQuery(this.searchControl.value));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private cleanQuery(query: string | null): string {
    return query?.trim() || '';
  }
}

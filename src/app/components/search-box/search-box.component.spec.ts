import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  describe('SearchBoxComponent', () => {
    let component: SearchBoxComponent;
    let fixture: ComponentFixture<SearchBoxComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [SearchBoxComponent],
        imports: [ReactiveFormsModule],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(SearchBoxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should emit search event on button click (onSearch)', () => {
      spyOn(component.search, 'emit');

      component.searchControl.setValue(' Angular ');
      component.onSearch();

      expect(component.search.emit).toHaveBeenCalledWith('Angular');
    });

    it('should emit debounced and distinct search value', fakeAsync(() => {
      const emitSpy = spyOn(component.search, 'emit');

      component.searchControl.setValue('test');
      tick(400);
      expect(emitSpy).toHaveBeenCalledWith('test');

      emitSpy.calls.reset();

      component.searchControl.setValue('test');
      tick(400);
      expect(emitSpy.calls.count()).toBe(0);
    }));

    it('should unsubscribe on destroy', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});

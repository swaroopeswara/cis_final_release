import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRequestsComponent } from './search-requests.component';

describe('SearchRequestsComponent', () => {
  let component: SearchRequestsComponent;
  let fixture: ComponentFixture<SearchRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

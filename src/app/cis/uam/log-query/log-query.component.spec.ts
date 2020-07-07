import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogQueryComponent } from './log-query.component';

describe('LogQueryComponent', () => {
  let component: LogQueryComponent;
  let fixture: ComponentFixture<LogQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

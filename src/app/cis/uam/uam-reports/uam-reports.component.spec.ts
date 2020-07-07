import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UamReportsComponent } from './uam-reports.component';

describe('UamReportsComponent', () => {
  let component: UamReportsComponent;
  let fixture: ComponentFixture<UamReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UamReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UamReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

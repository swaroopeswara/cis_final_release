import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImConfigComponent } from './iml-config.component';

describe('ImConfigComponent', () => {
  let component: ImConfigComponent;
  let fixture: ComponentFixture<ImConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

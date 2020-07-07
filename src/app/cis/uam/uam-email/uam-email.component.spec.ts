import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UamEmailComponent } from './uam-email.component';

describe('UamEmailComponent', () => {
  let component: UamEmailComponent;
  let fixture: ComponentFixture<UamEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UamEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UamEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

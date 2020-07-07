import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAssistantComponent } from './my-assistants.component';

describe('MyAssistantComponent', () => {
  let component: MyAssistantComponent;
  let fixture: ComponentFixture<MyAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAssistantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

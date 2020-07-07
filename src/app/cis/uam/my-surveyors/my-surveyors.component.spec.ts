import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySurveyorsComponent } from './my-surveyors.component';

describe('MySurveyorsComponent', () => {
  let component: MySurveyorsComponent;
  let fixture: ComponentFixture<MySurveyorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySurveyorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySurveyorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

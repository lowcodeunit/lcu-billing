import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPlanChangeComponent } from './confirm-plan-change.component';

describe('ConfirmPlanChangeComponent', () => {
  let component: ConfirmPlanChangeComponent;
  let fixture: ComponentFixture<ConfirmPlanChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmPlanChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPlanChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

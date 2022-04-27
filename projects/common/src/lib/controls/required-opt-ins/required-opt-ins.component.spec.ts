import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredOptInsComponent } from './required-opt-ins.component';

describe('RequiredOptInsComponent', () => {
  let component: RequiredOptInsComponent;
  let fixture: ComponentFixture<RequiredOptInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequiredOptInsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredOptInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

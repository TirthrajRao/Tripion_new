import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeToTravelComponent } from './safe-to-travel.component';

describe('SafeToTravelComponent', () => {
  let component: SafeToTravelComponent;
  let fixture: ComponentFixture<SafeToTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeToTravelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeToTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassportsComponent } from './passports.component';

describe('PassportsComponent', () => {
  let component: PassportsComponent;
  let fixture: ComponentFixture<PassportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassportsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

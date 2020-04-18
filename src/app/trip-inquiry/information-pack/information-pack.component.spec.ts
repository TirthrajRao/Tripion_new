import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationPackComponent } from './information-pack.component';

describe('InformationPackComponent', () => {
  let component: InformationPackComponent;
  let fixture: ComponentFixture<InformationPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationPackComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

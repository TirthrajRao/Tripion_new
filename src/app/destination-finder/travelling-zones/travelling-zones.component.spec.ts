import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellingZonesComponent } from './travelling-zones.component';

describe('TravellingZonesComponent', () => {
  let component: TravellingZonesComponent;
  let fixture: ComponentFixture<TravellingZonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravellingZonesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravellingZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

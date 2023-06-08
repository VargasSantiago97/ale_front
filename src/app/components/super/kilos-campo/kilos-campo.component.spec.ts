import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KilosCampoComponent } from './kilos-campo.component';

describe('KilosCampoComponent', () => {
  let component: KilosCampoComponent;
  let fixture: ComponentFixture<KilosCampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KilosCampoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KilosCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

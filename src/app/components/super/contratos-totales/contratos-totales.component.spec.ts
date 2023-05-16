import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosTotalesComponent } from './contratos-totales.component';

describe('ContratosTotalesComponent', () => {
  let component: ContratosTotalesComponent;
  let fixture: ComponentFixture<ContratosTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratosTotalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratosTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

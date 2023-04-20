import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasCorrientesComponent } from './cuentas-corrientes.component';

describe('CuentasCorrientesComponent', () => {
  let component: CuentasCorrientesComponent;
  let fixture: ComponentFixture<CuentasCorrientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasCorrientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasCorrientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionDetalleComponent } from './produccion-detalle.component';

describe('ProduccionDetalleComponent', () => {
  let component: ProduccionDetalleComponent;
  let fixture: ComponentFixture<ProduccionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduccionDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

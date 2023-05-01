import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosEmitidosComponent } from './pagos-emitidos.component';

describe('PagosEmitidosComponent', () => {
  let component: PagosEmitidosComponent;
  let fixture: ComponentFixture<PagosEmitidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagosEmitidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosEmitidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

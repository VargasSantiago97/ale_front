import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepararPagosComponent } from './preparar-pagos.component';

describe('PrepararPagosComponent', () => {
  let component: PrepararPagosComponent;
  let fixture: ComponentFixture<PrepararPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepararPagosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepararPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

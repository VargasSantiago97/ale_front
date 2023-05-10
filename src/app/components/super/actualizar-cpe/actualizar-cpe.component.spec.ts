import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCPEComponent } from './actualizar-cpe.component';

describe('ActualizarCPEComponent', () => {
  let component: ActualizarCPEComponent;
  let fixture: ComponentFixture<ActualizarCPEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarCPEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarCPEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

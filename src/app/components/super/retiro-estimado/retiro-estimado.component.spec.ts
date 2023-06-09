import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiroEstimadoComponent } from './retiro-estimado.component';

describe('RetiroEstimadoComponent', () => {
  let component: RetiroEstimadoComponent;
  let fixture: ComponentFixture<RetiroEstimadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetiroEstimadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetiroEstimadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

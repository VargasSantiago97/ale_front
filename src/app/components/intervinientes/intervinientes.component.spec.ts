import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervinientesComponent } from './intervinientes.component';

describe('IntervinientesComponent', () => {
  let component: IntervinientesComponent;
  let fixture: ComponentFixture<IntervinientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervinientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervinientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

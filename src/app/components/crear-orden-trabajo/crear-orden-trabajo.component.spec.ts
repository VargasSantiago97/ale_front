import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearOrdenTrabajoComponent } from './crear-orden-trabajo.component';

describe('CrearOrdenTrabajoComponent', () => {
  let component: CrearOrdenTrabajoComponent;
  let fixture: ComponentFixture<CrearOrdenTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearOrdenTrabajoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearOrdenTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

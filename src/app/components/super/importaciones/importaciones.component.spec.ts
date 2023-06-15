import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacionesComponent } from './importaciones.component';

describe('ImportacionesComponent', () => {
  let component: ImportacionesComponent;
  let fixture: ComponentFixture<ImportacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

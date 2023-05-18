import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionSilosComponent } from './produccion-silos.component';

describe('ProduccionSilosComponent', () => {
  let component: ProduccionSilosComponent;
  let fixture: ComponentFixture<ProduccionSilosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduccionSilosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionSilosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

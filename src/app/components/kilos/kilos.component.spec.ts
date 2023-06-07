import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KilosComponent } from './kilos.component';

describe('KilosComponent', () => {
  let component: KilosComponent;
  let fixture: ComponentFixture<KilosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KilosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KilosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

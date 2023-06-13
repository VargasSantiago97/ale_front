import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KilosBalanzaComponent } from './kilos-balanza.component';

describe('KilosBalanzaComponent', () => {
  let component: KilosBalanzaComponent;
  let fixture: ComponentFixture<KilosBalanzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KilosBalanzaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KilosBalanzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

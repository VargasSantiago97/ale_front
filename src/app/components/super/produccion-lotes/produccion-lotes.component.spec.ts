import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionLotesComponent } from './produccion-lotes.component';

describe('ProduccionLotesComponent', () => {
  let component: ProduccionLotesComponent;
  let fixture: ComponentFixture<ProduccionLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduccionLotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

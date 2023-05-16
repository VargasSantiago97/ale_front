import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosCtgComponent } from './contratos-ctg.component';

describe('ContratosCtgComponent', () => {
  let component: ContratosCtgComponent;
  let fixture: ComponentFixture<ContratosCtgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratosCtgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratosCtgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

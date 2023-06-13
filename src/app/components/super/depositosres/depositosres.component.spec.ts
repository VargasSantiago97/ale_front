import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositosresComponent } from './depositosres.component';

describe('DepositosComponent', () => {
  let component: DepositosresComponent;
  let fixture: ComponentFixture<DepositosresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositosresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositosresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GranosComponent } from './granos.component';

describe('GranosComponent', () => {
  let component: GranosComponent;
  let fixture: ComponentFixture<GranosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GranosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GranosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

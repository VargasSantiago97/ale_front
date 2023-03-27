import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionIvaComponent } from './condicion-iva.component';

describe('CondicionIvaComponent', () => {
  let component: CondicionIvaComponent;
  let fixture: ComponentFixture<CondicionIvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondicionIvaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondicionIvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

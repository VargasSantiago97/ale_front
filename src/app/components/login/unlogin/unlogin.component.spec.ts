import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloginComponent } from './unlogin.component';

describe('UnloginComponent', () => {
  let component: UnloginComponent;
  let fixture: ComponentFixture<UnloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnloginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

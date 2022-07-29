import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTopBarComponent } from './main-top-bar.component';

describe('MainTopBarComponent', () => {
  let component: MainTopBarComponent;
  let fixture: ComponentFixture<MainTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTopBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

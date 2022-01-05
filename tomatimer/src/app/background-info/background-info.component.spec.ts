import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundInfoComponent } from './background-info.component';

describe('BackgroundInfoComponent', () => {
  let component: BackgroundInfoComponent;
  let fixture: ComponentFixture<BackgroundInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

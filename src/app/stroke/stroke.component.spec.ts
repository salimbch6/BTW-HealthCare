import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeComponent } from './stroke.component';

describe('StrokeComponent', () => {
  let component: StrokeComponent;
  let fixture: ComponentFixture<StrokeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrokeComponent]
    });
    fixture = TestBed.createComponent(StrokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

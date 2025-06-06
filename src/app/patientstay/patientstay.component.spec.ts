import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientstayComponent } from './patientstay.component';

describe('PatientstayComponent', () => {
  let component: PatientstayComponent;
  let fixture: ComponentFixture<PatientstayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientstayComponent]
    });
    fixture = TestBed.createComponent(PatientstayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

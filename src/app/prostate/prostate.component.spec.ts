import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProstateComponent } from './prostate.component';

describe('ProstateComponent', () => {
  let component: ProstateComponent;
  let fixture: ComponentFixture<ProstateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProstateComponent]
    });
    fixture = TestBed.createComponent(ProstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

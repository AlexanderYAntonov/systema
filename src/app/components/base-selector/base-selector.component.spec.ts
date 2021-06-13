import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BaseSelectorComponent } from './base-selector.component';

xdescribe('BaseSelectorComponent', () => {
  let component: BaseSelectorComponent;
  let fixture: ComponentFixture<BaseSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

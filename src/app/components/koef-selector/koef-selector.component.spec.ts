import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KoefSelectorComponent } from './koef-selector.component';

xdescribe('KoefSelectorComponent', () => {
  let component: KoefSelectorComponent;
  let fixture: ComponentFixture<KoefSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KoefSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoefSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

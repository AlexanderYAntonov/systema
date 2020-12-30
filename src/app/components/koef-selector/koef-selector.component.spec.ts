import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoefSelectorComponent } from './koef-selector.component';

xdescribe('KoefSelectorComponent', () => {
  let component: KoefSelectorComponent;
  let fixture: ComponentFixture<KoefSelectorComponent>;

  beforeEach(async(() => {
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

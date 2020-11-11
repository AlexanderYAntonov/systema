import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBuilderComponent } from './base-builder.component';

describe('BaseBuilderComponent', () => {
  let component: BaseBuilderComponent;
  let fixture: ComponentFixture<BaseBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

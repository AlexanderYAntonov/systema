import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BaseBuilderComponent, MatchResult } from './base-builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('BaseBuilderComponent', () => {
  let component: BaseBuilderComponent;
  let fixture: ComponentFixture<BaseBuilderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBuilderComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
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

  it('should calc total match string', () => {
    let match1: MatchResult = new MatchResult('TeamA - TeamB 2:0');
    let match2: MatchResult = new MatchResult('TeamB - TeamC 2:0');
    let match3: MatchResult = new MatchResult('TeamC - TeamA 1:1');
    let matchesArr = [match1, match2, match3];
    let teamATotal = component.buildTotal(matchesArr, 'TeamA');
    expect(teamATotal).toBe('1 1 0 3:1');
  });

  it('should calc home match string', () => {
    let match1: MatchResult = new MatchResult('TeamA - TeamB 2:0');
    let match2: MatchResult = new MatchResult('TeamB - TeamC 2:0');
    let match3: MatchResult = new MatchResult('TeamC - TeamA 1:1');
    let matchesArr = [match1, match2, match3];
    let teamCHome = component.buildHomeIn(matchesArr, 'TeamC');
    expect(teamCHome).toBe('0 1 0 1:1');
  });

  it('should calc visitor match string', () => {
    let match1: MatchResult = new MatchResult('TeamA - TeamB 2:0');
    let match2: MatchResult = new MatchResult('TeamB - TeamC 2:0');
    let match3: MatchResult = new MatchResult('TeamC - TeamA 1:1');
    let matchesArr = [match1, match2, match3];
    let teamCOut = component.buildVisitorOut(matchesArr, 'TeamC');
    expect(teamCOut).toBe('0 0 1 0:2');
  });
});

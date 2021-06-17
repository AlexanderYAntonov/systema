import { TestBed } from '@angular/core/testing';

import { VektorService } from './vektor.service';
import { HttpClientModule } from '@angular/common/http';
import { GoalsPoint, NormalVektor, Result, Vektor, WinsPoint } from '../models/vektor';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

describe('VektorService', () => {

  const baseServiceStub: Partial<BaseService> = {
    getUrl(): Observable<string> {
      return new Observable();
    }
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [{ provide: BaseService, useService: baseServiceStub }]
    })
  );

  it('should be created', () => {
    const service: VektorService = TestBed.get(VektorService);
    expect(service).toBeTruthy();
  });

  it('should normalize goals shots', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 30';
    expect(service.calcGoalsPoint(source).shots).toBe(0.32);
  });

  it('should normalize goals shots', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '8 7 7   26 : 30 ';
    expect(service.calcGoalsPoint(source).shots).toBe(0.65);
  });

  it('should normalize goals shots', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '6 4 10 14:27';
    expect(service.calcGoalsPoint(source).shots).toBe(0.46);
  });

  it('should normalize goals loses', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 30';
    expect(service.calcGoalsPoint(source).loses).toBe(0.95);
  });

  it('should normalize goals loses', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 20';
    expect(service.calcGoalsPoint(source).loses).toBe(0.89);
  });

  it('should normalize matches wins', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 30';
    expect(service.calcWinsPoint(source).wins).toBe(0.71);
  });

  it('should normalize matches equals', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 30';
    expect(service.calcWinsPoint(source).equals).toBe(0);
  });

  it('should normalize matches equals', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 4 4   10 : 30';
    expect(service.calcWinsPoint(source).equals).toBe(0.58);
  });

  it('should normalize matches loses', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 6   10 : 30';
    expect(service.calcWinsPoint(source).loses).toBe(0.83);
  });

  it('should calc distance between goals points', () => {
    const service: VektorService = TestBed.get(VektorService);
    const pointA: GoalsPoint = { shots: 0.5, loses: 0.5 };
    const pointB: GoalsPoint = { shots: 1, loses: 0 };
    expect(service.calcDistancePoints(pointA, pointB)).toBe(0.5);
  });

  it('should calc distance between goals points', () => {
    const service: VektorService = TestBed.get(VektorService);
    const pointA: GoalsPoint = { shots: 0.3, loses: 0.7 };
    const pointB: GoalsPoint = { shots: 0.6, loses: 0.4 };
    expect(service.calcDistancePoints(pointA, pointB)).toBe(0.18);
  });

  it('should calc distance between matches points', () => {
    const service: VektorService = TestBed.get(VektorService);
    const pointA: WinsPoint = { wins: 0.4, equals: 0.2, loses: 0.4 };
    const pointB: WinsPoint = { wins: 0.4, equals: 0.2, loses: 0.4 };
    expect(service.calcDistancePoints(pointA, pointB)).toBe(0);
  });

  it('should calc distance between matches points', () => {
    const service: VektorService = TestBed.get(VektorService);
    const pointA: WinsPoint = { wins: 0.2, equals: 0.4, loses: 0.4 };
    const pointB: WinsPoint = { wins: 0.4, equals: 0.2, loses: 0.4 };
    expect(service.calcDistancePoints(pointA, pointB)).toBe(0.08);
  });

  it('should calc distance between normal vektors', () => {
    const service: VektorService = TestBed.get(VektorService);
    const vektorA: NormalVektor = {
      homeTotalMatches: { wins: 0.4, equals: 0.4, loses: 0.2 },
      homeInMatches: { wins: 0.5, equals: 0, loses: 0.5 },
      visitorTotalMatches: { wins: 0.3, equals: 0.3, loses: 0.4 },
      visitorOutMatches: { wins: 0.2, equals: 0.4, loses: 0.4 },
      homeTotalGoals: { shots: 0.4, loses: 0.6 },
      homeInGoals: { shots: 0.3, loses: 0.7 },
      visitorTotalGoals: { shots: 0.1, loses: 0.9 },
      visitorOutGoals: { shots: 0.2, loses: 0.8 },
      shotsInterval: null,
      losesInterval: null,
      result: Result.Win,
    };
    const vektorB: NormalVektor = {
      homeTotalMatches: { wins: 0.5, equals: 0.2, loses: 0.3 },
      homeInMatches: { wins: 0.4, equals: 0.2, loses: 0.4 },
      visitorTotalMatches: { wins: 0.7, equals: 0.2, loses: 0.1 },
      visitorOutMatches: { wins: 0.4, equals: 0.4, loses: 0.2 },
      homeTotalGoals: { shots: 0.6, loses: 0.4 },
      homeInGoals: { shots: 0.4, loses: 0.6 },
      visitorTotalGoals: { shots: 0.2, loses: 0.8 },
      visitorOutGoals: { shots: 0.3, loses: 0.7 },
      shotsInterval: null,
      losesInterval: null,
      result: Result.Equal,
    };
    expect(service.calcDistance(vektorA, vektorB)).toBe(0.6);
  });

  it('should renormalize match point', () => {
    const service: VektorService = TestBed.get(VektorService);
    const pointA: WinsPoint = { wins: 2, equals: 4, loses: 4 };
    expect(service.renormalizePoint(pointA).loses).toBe(0.4);
  });

  it('should renormalize vektor', () => {
    const service: VektorService = TestBed.get(VektorService);
    const vektorA: NormalVektor = {
      homeTotalMatches: { wins: 4, equals: 4, loses: 2 },
      homeInMatches: { wins: 0.5, equals: 0, loses: 0.5 },
      visitorTotalMatches: { wins: 0.3, equals: 0.3, loses: 0.4 },
      visitorOutMatches: { wins: 0.2, equals: 0.4, loses: 0.4 },
      homeTotalGoals: { shots: 0.4, loses: 0.6 },
      homeInGoals: { shots: 3, loses: 7 },
      visitorTotalGoals: { shots: 0.1, loses: 0.9 },
      visitorOutGoals: { shots: 0.2, loses: 0.8 },
      shotsInterval: null,
      losesInterval: null,
      result: Result.Win,
    };
    expect(service.renormalizeVektor(vektorA).homeTotalMatches.wins).toBe(0.4);
  });

  it('should renormalize vektor', () => {
    const service: VektorService = TestBed.get(VektorService);
    const vektorA: NormalVektor = {
      homeTotalMatches: { wins: 4, equals: 4, loses: 2 },
      homeInMatches: { wins: 0.5, equals: 0, loses: 0.5 },
      visitorTotalMatches: { wins: 0.3, equals: 0.3, loses: 0.4 },
      visitorOutMatches: { wins: 0.2, equals: 0.4, loses: 0.4 },
      homeTotalGoals: { shots: 0.4, loses: 0.6 },
      homeInGoals: { shots: 3, loses: 7 },
      visitorTotalGoals: { shots: 0.1, loses: 0.9 },
      visitorOutGoals: { shots: 0.2, loses: 0.8 },
      shotsInterval: null,
      losesInterval: null,
      result: Result.Win,
    };
    expect(service.renormalizeVektor(vektorA).homeInGoals.loses).toBe(0.7);
  });

  it('should calc shotsInterval', () => {
    const service: VektorService = TestBed.get(VektorService);
    const vektor: Vektor = {
      home: '1',
      homeTotal: '5 0 5 10:20',
      homeIn: '5 0 5 5:15',
      visitor: '2',
      visitorTotal: '5 0 5 30:10',
      visitorOut: '5 0 5 10:6',
      result: Result.Win,
    };
    expect(service.calcAverageTotal(vektor).shotsInterval.from).toBe(0.5);
  });

  it('should calc shotsInterval', () => {
    const service: VektorService = TestBed.get(VektorService);
    const vektor: Vektor = {
      home: '1',
      homeTotal: '5 0 5 10:20',
      homeIn: '5 0 5 5:15',
      visitor: '2',
      visitorTotal: '5 0 5 30:10',
      visitorOut: '5 0 5 10:6',
      result: Result.Win,
    };
    expect(service.calcAverageTotal(vektor).shotsInterval.to).toBe(1);
  });

  it('should calc losesInterval', () => {
    const service: VektorService = TestBed.get(VektorService);
    const vektor: Vektor = {
      home: '1',
      homeTotal: '5 0 5 10:20',
      homeIn: '5 0 5 5:15',
      visitor: '2',
      visitorTotal: '5 0 5 30:10',
      visitorOut: '5 0 5 10:6',
      result: Result.Win,
    };
    expect(service.calcAverageTotal(vektor).losesInterval.from).toBe(1);
  });

  it('should calc losesInterval', () => {
    const service: VektorService = TestBed.get(VektorService);
    const vektor: Vektor = {
      home: '1',
      homeTotal: '5 0 5 10:20',
      homeIn: '5 0 5 5:15',
      visitor: '2',
      visitorTotal: '5 0 5 30:10',
      visitorOut: '5 0 5 10:6',
      result: Result.Win,
    };
    expect(service.calcAverageTotal(vektor).losesInterval.to).toBe(3);
  });
});

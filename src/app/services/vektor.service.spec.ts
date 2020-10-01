import { TestBed } from '@angular/core/testing';

import { VektorService } from './vektor.service';
import { HttpClientModule } from '@angular/common/http';
import { GoalsPoint, WinsPoint } from '../models/vektor';

describe('VektorService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    })
  );

  it('should be created', () => {
    const service: VektorService = TestBed.get(VektorService);
    expect(service).toBeTruthy();
  });

  it('should normalize goals shots', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 30';
    expect(service.calcGoalsPoint(source).shots).toBe(0.25);
  });

  it('should normalize goals loses', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 30';
    expect(service.calcGoalsPoint(source).loses).toBe(0.75);
  });

  it('should normalize goals loses', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 20';
    expect(service.calcGoalsPoint(source).loses).toBe(0.66);
  });

  it('should normalize matches wins', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 30';
    expect(service.calcWinsPoint(source).wins).toBe(0.5);
  });

  it('should normalize matches equals', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 4   10 : 30';
    expect(service.calcWinsPoint(source).equals).toBe(0);
  });

  it('should normalize matches equals', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 4 4   10 : 30';
    expect(service.calcWinsPoint(source).equals).toBe(0.33);
  });

  it('should normalize matches loses', () => {
    const service: VektorService = TestBed.get(VektorService);
    const source = '4 0 6   10 : 30';
    expect(service.calcWinsPoint(source).loses).toBe(0.6);
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
    expect(Math.trunc(service.calcDistancePoints(pointA, pointB) * 10000)).toBe(
      1799
    );
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
    expect(Math.trunc(service.calcDistancePoints(pointA, pointB) * 100)).toBe(
      8
    );
  });
});

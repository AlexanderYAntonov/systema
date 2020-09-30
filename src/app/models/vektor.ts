export enum Result {
  Win = '1',
  Lose = '2',
  Equal = 'x'
}

export class Vektor {
  result: Result;
  home: string;
  homeTotal: string;
  homeIn: string;
  visitor: string;
  visitorTotal: string;
  visitorOut: string;
}

export interface WinsPoint {
  wins: number;
  equals: number;
  loses: number;
}

export interface GoalsPoint {
  shots: number;
  loses: number;
}

export class NormalVektor {
  homeTotalMatches: WinsPoint;
  homeInMatches: WinsPoint;
  visitorTotalMatches: WinsPoint;
  visitorOutMatches: WinsPoint;
  homeTotalGoals: GoalsPoint;
  homeInGoals: GoalsPoint;
  visitorTotalGoals: GoalsPoint;
  visitorOutGoals: GoalsPoint;

  constructor(
    homeTotalMatches: WinsPoint,
    homeInMatches: WinsPoint,
    visitorTotalMatches: WinsPoint,
    visitorOutMatches: WinsPoint,
    homeTotalGoals: GoalsPoint,
    homeInGoals: GoalsPoint,
    visitorTotalGoals: GoalsPoint,
    visitorOutGoals: GoalsPoint
  ) {
    this.homeTotalMatches = homeTotalMatches;
    this.homeInMatches = homeInMatches;
    this.visitorTotalMatches = visitorTotalMatches;
    this.visitorOutMatches = visitorOutMatches;
    this.homeTotalGoals = homeTotalGoals;
    this.homeInGoals = homeInGoals;
    this.visitorTotalGoals = visitorTotalGoals;
    this.visitorOutGoals = visitorOutGoals;
  }
}

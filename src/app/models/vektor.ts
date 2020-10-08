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

export type Point = GoalsPoint | WinsPoint;

export class NormalVektor {
  homeTotalMatches: WinsPoint;
  homeInMatches: WinsPoint;
  visitorTotalMatches: WinsPoint;
  visitorOutMatches: WinsPoint;
  homeTotalGoals: GoalsPoint;
  homeInGoals: GoalsPoint;
  visitorTotalGoals: GoalsPoint;
  visitorOutGoals: GoalsPoint;
  result?: Result;

  constructor(
    homeTotalMatches: WinsPoint,
    homeInMatches: WinsPoint,
    visitorTotalMatches: WinsPoint,
    visitorOutMatches: WinsPoint,
    homeTotalGoals: GoalsPoint,
    homeInGoals: GoalsPoint,
    visitorTotalGoals: GoalsPoint,
    visitorOutGoals: GoalsPoint,
    result?: Result
  ) {
    this.homeTotalMatches = homeTotalMatches;
    this.homeInMatches = homeInMatches;
    this.visitorTotalMatches = visitorTotalMatches;
    this.visitorOutMatches = visitorOutMatches;
    this.homeTotalGoals = homeTotalGoals;
    this.homeInGoals = homeInGoals;
    this.visitorTotalGoals = visitorTotalGoals;
    this.visitorOutGoals = visitorOutGoals;
    this.result = result;
  }
}

export interface DistantVektor extends NormalVektor {
  distance: number;
}

export class Prediction {
  result: Result;
  part: number;
  resultPair: Result[];
  partPair: number;

  constructor(
    result: Result,
    part: number,
    resultPair: Result[] = [],
    partPair: number = 0
  ) {
    this.result = result;
    this.part = part;
    this.resultPair = resultPair;
    this.partPair = partPair;
  }
}

export interface PredictResult {
  prediction: Prediction;
  result: Result;
}

export interface PredictPart {
  part: number;
  result: Result;
}

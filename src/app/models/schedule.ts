import { Observable } from "rxjs";
import { League } from "./leagues";
import { Prediction, Vektor } from "./vektor";

export interface LeagueSchedule {
    league: League;
    rows: ScheduleRowData[];
    ts: string;
    overall?: string[];
    home?: string[];
    away?: string[];
    overallForm?: {[key: string]: string[]};
    homeForm?: {[key: string]: string[]};
    awayForm?: {[key: string]: string[]};
    predictionsList$?: Observable<Prediction[]>;
    blockVektorList?: Vektor[];
  }
  export interface ScheduleRowData{
    teams: string[];
    odds: number[];
    dateTime: string;
    joinedRow: string;
  }
  
  export interface ScheduleResponse {
    rows: ScheduleRowData[];
    ts: string;
  }
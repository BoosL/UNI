export interface TmkStats {
  todayFollows: TmkStatsDetail;
  todayNews: TmkStatsDetail;
  todayTransferred: TmkStatsDetail;
  thirtyDayReservation: TmkStatsDetail;
  needCall: TmkStatsDetail;
  sevenDayRecycling: TmkStatsDetail;
}

export interface TmkStatsDetail {
  all: string;
  finish: string;
}

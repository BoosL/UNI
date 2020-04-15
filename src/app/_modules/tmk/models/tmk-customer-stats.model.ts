export interface TmkCustomerStats {
  todayFollows: TmkCustomersStatsDetail;
  todayNews: TmkCustomersStatsDetail;
  todayTransferred: TmkCustomersStatsDetail;
  thirtyDayReservation: TmkCustomersStatsDetail;
  needCall: TmkCustomersStatsDetail;
  sevenDayRecycling: TmkCustomersStatsDetail;
}

export interface TmkCustomersStatsDetail {
  all: string;
  finish: string;
}

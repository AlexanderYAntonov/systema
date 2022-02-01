export interface League {
  url: string;
  caption: string;
  country: string;
}

export const allLeagues: {[key: string]: League[]} = {
  soccerMajor : [
    {
      url: '/soccer/england/premier-league/',
      caption: 'Premier League',
      country: 'England'
    },
    // {
    //   url: '/soccer/spain/laliga/',
    //   caption: 'La Liga',
    //   country: 'Spain'
    // },
    // {
    //   url: '/soccer/wales/cymru-premier/',
    //   caption: 'Cymru premier',
    //   country: 'Wales'
    // },
    // {
    //   url: '/soccer/switzerland/super-league/',
    //   caption: 'Super league',
    //   country: 'Switzerland'
    // },
    // {
    //   url: '/soccer/northern-ireland/nifl-premiership/',
    //   caption: 'nifl premiership',
    //   country: 'Northern Ireland'
    // },
    // {
    //   url: '/soccer/germany/bundesliga/',
    //   caption: 'Bundesliga',
    //   country: 'Germany'
    // },
    // {
    //   url: '/soccer/italy/serie-a/',
    //   caption: 'Seria A',
    //   country: 'Italy'
    // },
    // {
    //   url: '/soccer/france/ligue-1/',
    //   caption: 'Ligue 1',
    //   country: 'France'
    // },
    // {
    //   url: '/soccer/netherlands/eredivisie/',
    //   caption: 'Eredivisie',
    //   country: 'Netherlands'
    // },
    // {
    //   url: '/soccer/portugal/liga-portugal/',
    //   caption: 'liga-portugal',
    //   country: 'Portugal'
    // },
    // {
    //   url: '/soccer/belgium/jupiler-pro-league/',
    //   caption: 'jupiler-pro',
    //   country: 'Belgium'
    // },
    // {
    //   url: '/soccer/russia/premier-league/',
    //   caption: 'Premier league',
    //   country: 'Russia'
    // },
    // {
    //   url: '/soccer/scotland/premiership/',
    //   caption: 'Premiership',
    //   country: 'Scotland'
    // },
    // until 04 2022
    // {
    //   url: '/soccer/sweden/allsvenskan/',
    //   caption: 'Allsvenskan',
    //   country: 'Sweden'
    // },
    // {
    //   url: '/soccer/serbia/super-liga/',
    //   caption: 'Super liga',
    //   country: 'Serbia'
    // },
    // {
    //   url: '/soccer/australia/a-league/',
    //   caption: 'A League',
    //   country: 'Australia'
    // },
    // {
    //   url: '/soccer/england/championship/',
    //   caption: 'Championship',
    //   country: 'England'
    // },
    // {
    //   url: '/soccer/greece/super-league/',
    //   caption: 'Supr league',
    //   country: 'Greece'
    // },
    // {
    //   url: '/soccer/czech-republic/1-liga/',
    //   caption: '1 liga',
    //   country: 'Czech'
    // },

  ],
  soccerMinor: [
    {
      url: '/soccer/england/league-one/',
      caption: 'League 1',
      country: 'England'
    },
    {
      url: '/soccer/england/league-two/',
      caption: 'League 2',
      country: 'England'
    },
    {
      url: '/soccer/spain/laliga2/',
      caption: 'La Liga 2',
      country: 'Spain'
    },
    {
      url: '/soccer/germany/2-bundesliga/',
      caption: 'Bundesliga 2',
      country: 'Germany'
    },
    {
      url: '/soccer/italy/serie-b/',
      caption: 'Seria B',
      country: 'Italy'
    },
    {
      url: '/soccer/france/ligue-2/',
      caption: 'Ligue 2',
      country: 'France'
    },
    {
      url: '/soccer/greece/super-league-2/',
      caption: 'Super Ligue 2',
      country: 'Greece'
    },
    {
      url: '/soccer/wales/cymru-south/',
      caption: 'Cymru South',
      country: 'Wales'
    },
    {
      url: '/soccer/wales/cymru-north/',
      caption: 'Cymru North',
      country: 'Wales'
    },
    {
      url: '/soccer/netherlands/eerste-divisie/',
      caption: 'Eerste divisie',
      country: 'Netherlands'
    },
    {
      url: '/soccer/portugal/liga-portugal-2/',
      caption: 'Liga Portugal 2',
      country: 'Portugal'
    },
    {
      url: '/soccer/switzerland/challenge-league/',
      caption: 'Challenge League',
      country: 'Switzerland'
    },
    {
      url: '/soccer/scotland/league-one/',
      caption: 'League 1',
      country: 'Scotland'
    },
    {
      url: '/soccer/scotland/league-two/',
      caption: 'League 2',
      country: 'Scotland'
    },
    {
      url: '/soccer/northern-ireland/nifl-championship/',
      caption: 'NIFL Championship',
      country: 'Northern Ireland'
    },

  ],
  handball: [
    {
      url: '/handball/germany/bundesliga/',
      caption: 'Bundesliga',
      country: 'Germany'
    },
    {
      url: '/handball/denmark/herre-handbold-ligaen/',
      caption: 'Herre handbold ligaen',
      country: 'Denmark'
    },
    {
      url: '/handball/spain/liga-asobal/',
      caption: 'Liga ASOBAL',
      country: 'Spain'
    },
    {
      url: '/handball/france/starligue/',
      caption: 'Starligue',
      country: 'France'
    },
    {
      url: '/handball/romania/liga-nationala/',
      caption: 'Liga nationala',
      country: 'Romania'
    },
    // MP	W	WO	LO	L - problem
    // {
    //   url: '/handball/poland/superliga/',
    //   caption: 'Superliga',
    //   country: 'Poland'
    // },
    {
      url: '/handball/austria/hla/',
      caption: 'HLA',
      country: 'Austria'
    },
    // until 04 2022
    // {
    //   url: '/handball/greece/a1/',
    //   caption: 'A1',
    //   country: 'Greece'
    // },
  ]
};

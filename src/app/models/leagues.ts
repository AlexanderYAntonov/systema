export interface League {
  url: string;
  caption: string;
  country: string;
}

export const allLeagues: {[key: string]: League[]} = {
  'soccer' : [
    {
      url: '/soccer/england/premier-league/',
      caption: 'Premier League',
      country: 'England'
    },
    {
      url: '/soccer/spain/laliga/',
      caption: 'La Liga',
      country: 'Spain'
    },
    {
      url: '/soccer/germany/bundesliga/',
      caption: 'Bundesliga',
      country: 'Germany'
    },
    {
      url: '/soccer/italy/serie-a/',
      caption: 'Seria A',
      country: 'Italy'
    },
    {
      url: '/soccer/france/ligue-1/',
      caption: 'Ligue 1',
      country: 'France'
    },
    {
      url: '/soccer/netherlands/eredivisie/',
      caption: 'Eredivisie',
      country: 'Netherlands'
    },
    {
      url: '/soccer/portugal/liga-portugal/',
      caption: 'liga-portugal',
      country: 'Portugal'
    },
    {
      url: '/soccer/belgium/jupiler-pro-league/',
      caption: 'jupiler-pro',
      country: 'Belgium'
    },
    {
      url: '/soccer/russia/premier-league/',
      caption: 'Premier league',
      country: 'Russia'
    },
    {
      url: '/soccer/scotland/premiership/',
      caption: 'Premiership',
      country: 'Scotland'
    },
    {
      url: '/soccer/sweden/allsvenskan/',
      caption: 'Allsvenskan',
      country: 'Sweden'
    },
    {
      url: '/soccer/serbia/super-liga/',
      caption: 'Super liga',
      country: 'Serbia'
    },
    {
      url: '/soccer/australia/a-league/',
      caption: 'A League',
      country: 'Australia'
    },
    {
      url: '/soccer/england/championship/',
      caption: 'Championship',
      country: 'England'
    },
    {
      url: '/soccer/greece/super-league/',
      caption: 'Supr league',
      country: 'Greece'
    },
  ],
  'handball': [
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
  ]
};
